export default async function handler(req, res) {
  const API_KEY = process.env.RA_API_KEY;
  const USERNAME = process.env.RA_USERNAME;

  if (!API_KEY || !USERNAME) {
    console.error(
      "Missing RA_API_KEY or RA_USERNAME in environment variables."
    );
    return res.status(500).json({
      error:
        "Server configuration error: Missing RetroAchievements API credentials.",
    });
  }

  const { gameId } = req.query;
  const targetUser = req.query.targetUser || USERNAME;

  if (!gameId || isNaN(Number(gameId))) {
    return res.status(400).json({ error: "Missing or invalid gameId." });
  }

  const BASE_DETAIL_URL =
    "https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php";
  const BASE_HASH_URL =
    "https://retroachievements.org/API/API_GetGameHashes.php";
  const MEDIA_PREFIX = "https://media.retroachievements.org";
  const BADGE_PREFIX = `${MEDIA_PREFIX}/Badge/`;

  try {
    const detailUrl = `${BASE_DETAIL_URL}?y=${API_KEY}&u=${targetUser}&g=${gameId}&a=1`;
    const hashUrl = `${BASE_HASH_URL}?y=${API_KEY}&i=${gameId}`;

    const [detailRes, hashRes] = await Promise.all([
      fetch(detailUrl),
      fetch(hashUrl),
    ]);

    let detailData;
    if (!detailRes.ok) {
      const text = await detailRes.text();
      try {
        const json = JSON.parse(text);
        throw new Error(
          json.Error || `RetroAchievements detail error: ${text}`
        );
      } catch {
        throw new Error(`RetroAchievements detail error (non-JSON): ${text}`);
      }
    }

    const detailContentType = detailRes.headers.get("content-type");
    if (detailContentType?.includes("application/json")) {
      detailData = await detailRes.json();
    } else {
      const text = await detailRes.text();
      try {
        detailData = JSON.parse(text);
      } catch {
        throw new Error(
          `Invalid detail JSON format for gameId ${gameId}: ${text}`
        );
      }
    }

    let hashData = { Results: [] };
    if (hashRes.ok) {
      try {
        const hashContentType = hashRes.headers.get("content-type");
        if (hashContentType?.includes("application/json")) {
          hashData = await hashRes.json();
        } else {
          const text = await hashRes.text();
          hashData = JSON.parse(text);
        }
      } catch (e) {
        console.warn(`Warning: Failed to parse hash data for gameId ${gameId}`);
      }
    } else {
      console.warn(`Hash fetch failed for gameId ${gameId}`);
    }

    if (!detailData || Object.keys(detailData).length === 0) {
      return res.status(404).json({
        error: `Game with ID ${gameId} not found or no data available.`,
      });
    }

    const {
      ID,
      Title,
      ConsoleID,
      ConsoleName,
      ImageIcon,
      ParentGameID,
      ...cleanedProgress
    } = detailData;

    const prefixMedia = (field) =>
      typeof field === "string" && field.startsWith("/")
        ? MEDIA_PREFIX + field
        : field;

    const prefixedGame = {
      GameID: ID,
      Title,
      ConsoleID,
      ConsoleName,
      ImageIcon: prefixMedia(ImageIcon),
      ParentGameID,
      MaxPossible: cleanedProgress.NumAchievements || 0,
      NumAwarded: cleanedProgress.NumAwardedToUser || 0,
      MostRecentAwardedDate: cleanedProgress.MostRecentAwardedDate || null,
      HighestAwardKind: cleanedProgress.HighestAwardKind || null,
      HighestAwardDate: cleanedProgress.HighestAwardDate || null,
    };

    const prefixedUserProgress = {
      ...cleanedProgress,
      ImageTitle: prefixMedia(cleanedProgress.ImageTitle),
      ImageIngame: prefixMedia(cleanedProgress.ImageIngame),
      ImageBoxArt: prefixMedia(cleanedProgress.ImageBoxArt),
    };

    if (prefixedUserProgress.Achievements) {
      Object.values(prefixedUserProgress.Achievements).forEach((ach) => {
        if (ach.BadgeName && !ach.BadgeName.startsWith("http")) {
          ach.BadgeName = `${BADGE_PREFIX}${ach.BadgeName}.png`;
        }
      });
    }

    return res.status(200).json({
      ...prefixedGame,
      Hashes: hashData.Results || [],
      UserProgress: prefixedUserProgress,
    });
  } catch (error) {
    console.error(
      `Error in game-detail API for gameId ${gameId}:`,
      error.message
    );
    return res.status(500).json({
      error: "Failed to fetch game details",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
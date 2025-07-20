let systemIconMapCache = null;
let systemIconMapLastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 12;

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

const fetchSystemIconMap = async (apiKey) => {
  if (
    systemIconMapCache &&
    Date.now() - systemIconMapLastFetch < CACHE_DURATION
  )
    return systemIconMapCache;

  const data = await fetchJson(
    `https://retroachievements.org/API/API_GetConsoleIDs.php?y=${encodeURIComponent(
      apiKey
    )}&a=1&g=1`
  );
  systemIconMapCache = Object.fromEntries(
    data
      .map(({ ID, IconURL }) => {
        const match = IconURL?.match(/\/([^\/]+)\.png$/);
        return match ? [String(ID), match[1]] : null;
      })
      .filter(Boolean)
  );
  systemIconMapLastFetch = Date.now();
  return systemIconMapCache;
};

const fetchUserProgress = async (apiKey, username, gameIds) => {
  if (!gameIds?.length) return {};
  const progressMap = {};
  const batchSize = 500;

  for (let i = 0; i < gameIds.length; i += batchSize) {
    const ids = gameIds.slice(i, i + batchSize).join(",");
    try {
      const data = await fetchJson(
        `https://retroachievements.org/API/API_GetUserProgress.php?y=${encodeURIComponent(
          apiKey
        )}&u=${encodeURIComponent(username)}&i=${encodeURIComponent(ids)}`
      );
      Object.assign(progressMap, data);
    } catch (e) {
      console.warn(`Progress fetch failed for batch ${i / batchSize + 1}`);
    }
  }

  return progressMap;
};

export default async function handler(req, res) {
  const { RA_API_KEY: apiKey, RA_USERNAME: envUsername } = process.env;
  const { username } = req.query;
  const user = username || envUsername;

  if (!apiKey)
    return res.status(500).json({ error: "Missing RA_API_KEY in env" });

  try {
    const [awards, icons, completed, progress] = await Promise.all([
      fetchJson(
        `https://retroachievements.org/API/API_GetUserAwards.php?y=${encodeURIComponent(
          apiKey
        )}&u=${encodeURIComponent(user)}`
      ),
      fetchSystemIconMap(apiKey),
      fetchJson(
        `https://retroachievements.org/API/API_GetUserCompletedGames.php?y=${encodeURIComponent(
          apiKey
        )}&u=${encodeURIComponent(user)}`
      ),
      fetchJson(
        `https://retroachievements.org/API/API_GetUserCompletionProgress.php?y=${encodeURIComponent(
          apiKey
        )}&u=${encodeURIComponent(user)}&c=500&o=0`
      ),
    ]);

    if (!Array.isArray(awards.VisibleUserAwards)) {
      return res
        .status(500)
        .json({ error: "Invalid awards data structure", data: awards });
    }

    const gameIds = [
      ...new Set(
        awards.VisibleUserAwards.map((a) => a.AwardData).filter(Boolean)
      ),
    ];
    const userProgress = await fetchUserProgress(apiKey, user, gameIds);

    const completedMap = new Map(
      completed.map((g) => [`${g.GameID}-${g.HardcoreMode}`, true])
    );
    const progressMap = new Map(
      (progress?.Results || []).map((g) => [g.GameID, g])
    );

    for (const a of awards.VisibleUserAwards) {
      const consoleId = String(a.ConsoleID);
      const icon = icons[consoleId];

      if (a.ImageIcon && !a.ImageIcon.startsWith("http")) {
        a.ImageIcon = `https://media.retroachievements.org${a.ImageIcon}`;
      }

      a.IconURL = icon
        ? `https://static.retroachievements.org/assets/images/system/${icon}.png`
        : null;

      a.HardcoreMode = completedMap.has(`${a.AwardData}-1`)
        ? "1"
        : completedMap.has(`${a.AwardData}-0`)
        ? "0"
        : null;

      a.CompletionProgress = progressMap.get(a.AwardData) || null;

      const p = userProgress[a.AwardData] || {};
      a.UserProgress = {
        NumAchieved: p.NumAchieved ?? 0,
        ScoreAchieved: p.ScoreAchieved ?? 0,
        NumAchievedHardcore: p.NumAchievedHardcore ?? 0,
        ScoreAchievedHardcore: p.ScoreAchievedHardcore ?? 0,
      };
    }

    res.status(200).json(awards);
  } catch (error) {
    console.error("Error in badge API:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch or process badge data",
        message: error.message,
      });
  }
}
let systemIconMapCache = null;
let systemIconMapLastFetch = 0;
const SYSTEM_ICON_CACHE_DURATION = 1000 * 60 * 60 * 12; 

const MEDIA_PREFIX = "https://media.retroachievements.org";
const SYSTEM_ICON_BASE =
  "https://static.retroachievements.org/assets/images/system";

const gameProgressCache = new Map();
const GAME_PROGRESS_CACHE_DURATION = 1000 * 60 * 5;

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) return true;

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

async function fetchSystemIconMap(apiKey) {
  if (
    systemIconMapCache &&
    Date.now() - systemIconMapLastFetch < SYSTEM_ICON_CACHE_DURATION
  ) {
    return systemIconMapCache;
  }

  const res = await fetch(
    `https://retroachievements.org/API/API_GetConsoleIDs.php?y=${encodeURIComponent(
      apiKey
    )}&a=1&g=1`
  );

  if (!res.ok) throw new Error("Failed to fetch console list");

  const data = await res.json();
  const map = new Map();

  data.forEach(({ ID, IconURL }) => {
    const match = IconURL?.match(/\/([^\/]+)\.png$/);
    if (ID && match) {
      map.set(parseInt(ID), match[1]);
    }
  });

  systemIconMapCache = map;
  systemIconMapLastFetch = Date.now();

  return map;
}

export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: true,
      message: "Too many requests. Please try again later.",
    });
  }

  const API_KEY = process.env.RA_API_KEY;
  const USERNAME = process.env.RA_USERNAME;

  if (!API_KEY || !USERNAME) {
    return res.status(500).json({
      error: "Missing RA_API_KEY or RA_USERNAME in environment variables.",
    });
  }

  const cached = gameProgressCache.get(USERNAME);
  if (cached && Date.now() - cached.timestamp < GAME_PROGRESS_CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  const BASE_LIST_URL =
    "https://retroachievements.org/API/API_GetUserCompletionProgress.php";
  const BASE_DETAIL_URL =
    "https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php";
  const BASE_HASH_URL =
    "https://retroachievements.org/API/API_GetGameHashes.php";

  const queryParams = new URLSearchParams({
    y: API_KEY,
    u: USERNAME,
    c: "500",
    o: "0",
  });

  const listUrl = `${BASE_LIST_URL}?${queryParams}`;

  try {
    const systemMap = await fetchSystemIconMap(API_KEY);

    const listResponse = await fetch(listUrl);
    if (!listResponse.ok)
      throw new Error("Failed to fetch user completion progress.");

    const listData = await listResponse.json();

    const resultsWithDetails = await Promise.all(
      listData.Results.map(async (game) => {
        const gameID = game.GameID.toString();
        const detailUrl = `${BASE_DETAIL_URL}?y=${API_KEY}&u=${USERNAME}&g=${gameID}&a=1`;
        const hashUrl = `${BASE_HASH_URL}?y=${API_KEY}&i=${gameID}`;

        const addMediaPrefix = (field) => {
          if (typeof field === "string" && field.startsWith("/")) {
            return MEDIA_PREFIX + field;
          }
          return field;
        };

        const consoleKey = parseInt(game.ConsoleID);
        const consoleIcon = systemMap.has(consoleKey)
          ? `${SYSTEM_ICON_BASE}/${systemMap.get(consoleKey)}.png`
          : null;

        const baseGame = {
          ...game,
          ImageIcon: addMediaPrefix(game.ImageIcon),
          ConsoleIcon: consoleIcon,
        };

        try {
          const [detailRes, hashRes] = await Promise.all([
            fetch(detailUrl),
            fetch(hashUrl),
          ]);

          if (!detailRes.ok || !hashRes.ok) throw new Error();

          const detailData = await detailRes.json();
          const hashData = await hashRes.json();

          const {
            ID,
            Title,
            ConsoleID,
            ConsoleName,
            ImageIcon,
            ParentGameID,
            Achievements,
            ...cleanedProgress
          } = detailData;

          const prefixedUserProgress = {
            ...cleanedProgress,
            ImageTitle: addMediaPrefix(cleanedProgress.ImageTitle),
            ImageIngame: addMediaPrefix(cleanedProgress.ImageIngame),
            ImageBoxArt: addMediaPrefix(cleanedProgress.ImageBoxArt),
          };

          return {
            ...baseGame,
            Hashes: hashData.Results || [],
            UserProgress: prefixedUserProgress,
          };
        } catch {
          return {
            ...baseGame,
            UserProgress: null,
            Hashes: [],
            error: `Failed to fetch detail/hash for GameID ${gameID}`,
          };
        }
      })
    );

    const responseData = {
      Count: listData.Count,
      Total: listData.Total,
      Results: resultsWithDetails,
    };

    gameProgressCache.set(USERNAME, {
      timestamp: Date.now(),
      data: responseData,
    });

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in game-progress API:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
}
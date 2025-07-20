let systemIconMapCache = null;
let systemIconMapLastFetch = 0;
const SYSTEM_CACHE_DURATION = 1000 * 60 * 60 * 12;

const profileCache = new Map();
const PROFILE_CACHE_DURATION = 1000 * 60 * 5;

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitMap = new Map();

function rateLimiter(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

async function fetchSystemIconMap(apiKey) {
  if (
    systemIconMapCache &&
    Date.now() - systemIconMapLastFetch < SYSTEM_CACHE_DURATION
  ) {
    return systemIconMapCache;
  }

  const res = await fetch(
    `https://retroachievements.org/API/API_GetConsoleIDs.php?y=${encodeURIComponent(
      apiKey
    )}&a=1&g=1`
  );

  if (!res.ok) throw new Error("Failed to fetch system list");

  const data = await res.json();
  const map = {};
  data.forEach(({ ID, IconURL }) => {
    const match = IconURL?.match(/\/([^\/]+)\.png$/);
    if (ID && match) map[ID] = match[1];
  });

  systemIconMapCache = map;
  systemIconMapLastFetch = Date.now();
  return map;
}

export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  if (!rateLimiter(ip)) {
    return res.status(429).json({
      error: true,
      message: "Too many requests. Please wait and try again.",
    });
  }

  const { RA_USERNAME: username, RA_API_KEY: apiKey } = process.env;
  if (!username || !apiKey) {
    return res
      .status(500)
      .json({ error: "Missing RA_USERNAME or RA_API_KEY in environment" });
  }

  const cached = profileCache.get(username);
  if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  const url = `https://retroachievements.org/API/API_GetUserWantToPlayList.php?u=${encodeURIComponent(
    username
  )}&y=${encodeURIComponent(apiKey)}&c=500&o=0`;

  try {
    console.log(`Fetching Want To Play list for ${username}`);
    const r = await fetch(url);
    if (!r.ok) {
      throw new Error(`RA API error: ${r.status} ${r.statusText}`);
    }

    const data = await r.json();
    const systemMap = await fetchSystemIconMap(apiKey);

    const wantToPlayList = Array.isArray(data.Results)
      ? data.Results.map((item) => ({
          ...item,
          ImageIcon: item.ImageIcon
            ? `https://media.retroachievements.org${item.ImageIcon}`
            : null,
          IconURL: systemMap[item.ConsoleID]
            ? `https://static.retroachievements.org/assets/images/system/${
                systemMap[item.ConsoleID]
              }.png`
            : null,
        }))
      : [];

    const responseData = {
      count: data.Count || wantToPlayList.length,
      total: data.Total || wantToPlayList.length,
      wantToPlayList,
    };

    profileCache.set(username, {
      timestamp: Date.now(),
      data: responseData,
    });

    res.status(200).json(responseData);
  } catch (e) {
    console.error("Error fetching Want To Play list:", e);
    res.status(500).json({
      error: "Failed to fetch Want To Play list",
      message: e.message,
      timestamp: new Date().toISOString(),
    });
  }
}
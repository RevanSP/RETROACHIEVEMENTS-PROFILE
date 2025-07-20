const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
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

  const apiKey = process.env.RA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: true,
      message: "Missing RA_API_KEY in environment variables",
    });
  }

  const baseUrl = "https://retroachievements.org/API/API_GetUsersIFollow.php";
  const url = `${baseUrl}?y=${encodeURIComponent(apiKey)}&c=500&o=0`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `RA API error: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const data = await response.json();

    const users = Array.isArray(data.Results)
      ? data.Results.map((u) => ({
          ...u,
          UserPic: `https://media.retroachievements.org/UserPic/${encodeURIComponent(
            u.User
          )}.png`,
        }))
      : [];

    return res.status(200).json({
      count: users.length,
      results: users,
    });
  } catch (err) {
    console.error("Error fetching users I follow:", err);
    return res.status(500).json({
      error: true,
      message: err.message || "Unexpected error",
      timestamp: new Date().toISOString(),
    });
  }
}
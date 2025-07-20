let systemIconMapCache = null;
let systemIconMapLastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 12;

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitMap = new Map();

const profileCache = new Map();
const PROFILE_CACHE_DURATION = 5 * 60 * 1000;

const fetchSystemIconMap = async (apiKey) => {
  if (
    systemIconMapCache &&
    Date.now() - systemIconMapLastFetch < CACHE_DURATION
  ) {
    return systemIconMapCache;
  }

  try {
    const res = await fetch(
      `https://retroachievements.org/API/API_GetConsoleIDs.php?y=${encodeURIComponent(
        apiKey
      )}&a=1&g=1`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RetroAchievements-Profile/1.0)",
        },
      }
    );

    if (!res.ok) throw new Error(`Failed to fetch system list: ${res.status}`);
    const data = await res.json();

    const map = {};
    if (Array.isArray(data)) {
      data.forEach(({ ID, IconURL }) => {
        const match = IconURL?.match(/\/([^\/]+)\.png$/);
        if (ID && match) map[ID] = match[1];
      });
    }

    systemIconMapCache = map;
    systemIconMapLastFetch = Date.now();
    return map;
  } catch (error) {
    console.error("Error fetching system icon map:", error);
    return {};
  }
};

const addMediaPrefix = (obj, fields, media) => {
  if (!obj) return;
  fields.forEach((f) => {
    if (obj?.[f]?.startsWith("/")) {
      obj[f] = media + obj[f];
    }
  });
};

const rateLimiter = (ip) => {
  const currentTime = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const timestamps = rateLimitMap
    .get(ip)
    .filter((timestamp) => currentTime - timestamp < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  timestamps.push(currentTime);
  rateLimitMap.set(ip, timestamps);
  return true;
};

export default async function handler(req, res) {
  console.log("=== Profile API Handler Called ===");

  const ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  if (!rateLimiter(ip)) {
    return res.status(429).json({
      error: true,
      message: "Too many requests. Please wait and try again.",
    });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { RA_USERNAME: username, RA_API_KEY: apiKey } = process.env;
    if (!username || !apiKey) {
      return res.status(500).json({
        error: true,
        message: "Missing RA_USERNAME or RA_API_KEY in environment variables",
        profile: null,
        game: null,
      });
    }

    const targetUser = req.query.targetUser || username;

    const cached = profileCache.get(targetUser);
    if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_DURATION) {
      return res.status(200).json(cached.data);
    }

    const base = "https://retroachievements.org/API";
    const media = "https://media.retroachievements.org";

    const fetchJson = async (url) => {
      const r = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; RetroAchievements-Profile/1.0)",
        },
      });

      if (!r.ok) {
        const errorBody = await r.text();
        throw new Error(`RA API error: ${r.status} ${errorBody}`);
      }
      return r.json();
    };

    const profileUrl = `${base}/API_GetUserSummary.php?u=${encodeURIComponent(
      targetUser
    )}&y=${encodeURIComponent(apiKey)}&g=1&a=1`;

    const profile = await fetchJson(profileUrl);

    if (!profile || typeof profile !== "object") {
      return res.status(500).json({
        error: true,
        message: "Invalid profile data received from RetroAchievements API",
        profile: null,
        game: null,
      });
    }

    if (profile.UserPic?.startsWith("/")) {
      profile.UserPic = media + profile.UserPic;
    }

    if (profile.MemberSince) {
      try {
        const d = new Date(profile.MemberSince);
        const pad = (n) => n.toString().padStart(2, "0");
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        if (!isNaN(d.getTime())) {
          profile.FormattedMemberSince = `${d.getDate()} ${
            months[d.getMonth()]
          } ${d.getFullYear()}, ${pad(d.getHours())}:${pad(
            d.getMinutes()
          )}:${pad(d.getSeconds())}`;
        } else {
          profile.FormattedMemberSince = profile.MemberSince;
        }
      } catch {
        profile.FormattedMemberSince = profile.MemberSince;
      }
    }

    const enhanced = {
      ...profile,
      Status: profile.Status || "Unknown",
      TotalRanked: profile.TotalRanked || profile.Rank || 0,
      TotalSoftcorePoints: profile.TotalSoftcorePoints || 0,
      User: profile.User || targetUser,
      Motto: profile.Motto || "",
      LastActivity: profile.LastActivity || {
        ID: 0,
        timestamp: null,
        lastupdate: null,
        activitytype: null,
        User: profile.User || targetUser,
        data: null,
        data2: null,
      },
    };

    const iconMap = await fetchSystemIconMap(apiKey);

    if (enhanced.LastGame) {
      addMediaPrefix(
        enhanced.LastGame,
        ["ImageIcon", "ImageTitle", "ImageIngame", "ImageBoxArt"],
        media
      );
    }

    if (enhanced.RecentlyPlayed && Array.isArray(enhanced.RecentlyPlayed)) {
      enhanced.RecentlyPlayed.forEach((g) =>
        addMediaPrefix(
          g,
          ["ImageIcon", "ImageTitle", "ImageIngame", "ImageBoxArt"],
          media
        )
      );
    }

    if (enhanced.RecentAchievements) {
      for (const gameId in enhanced.RecentAchievements) {
        const achievements = enhanced.RecentAchievements[gameId];
        if (achievements && typeof achievements === "object") {
          for (const achId in achievements) {
            const a = achievements[achId];
            if (a?.BadgeName && !a.BadgeName.startsWith("http")) {
              a.BadgeName = `${media}/Badge/${a.BadgeName}.png`;
            }
          }
        }
      }
    }

    const lastId = profile.LastGameID;
    if (!lastId) {
      const responseData = {
        profile: enhanced,
        game: null,
        message: "No LastGameID found",
      };
      profileCache.set(targetUser, {
        timestamp: Date.now(),
        data: responseData,
      });
      return res.status(200).json(responseData);
    }

    const recentUrl = `${base}/API_GetUserRecentlyPlayedGames.php?u=${encodeURIComponent(
      targetUser
    )}&y=${encodeURIComponent(apiKey)}&c=50`;

    const recent = await fetchJson(recentUrl);

    if (!Array.isArray(recent)) {
      const responseData = {
        profile: enhanced,
        game: null,
        message: "Recent games data is not in expected format",
      };
      profileCache.set(targetUser, {
        timestamp: Date.now(),
        data: responseData,
      });
      return res.status(200).json(responseData);
    }

    const game = recent.find((g) => g.GameID == lastId);
    if (!game) {
      const responseData = {
        profile: enhanced,
        game: null,
        message: "LastGameID not found in recent games",
      };
      profileCache.set(targetUser, {
        timestamp: Date.now(),
        data: responseData,
      });
      return res.status(200).json(responseData);
    }

    addMediaPrefix(
      game,
      ["GameIcon", "ImageIcon", "ImageTitle", "ImageIngame", "ImageBoxArt"],
      media
    );

    if (iconMap[game.ConsoleID]) {
      game.IconURL = `https://static.retroachievements.org/assets/images/system/${
        iconMap[game.ConsoleID]
      }.png`;
    }

    const responseData = { profile: enhanced, game };
    profileCache.set(targetUser, {
      timestamp: Date.now(),
      data: responseData,
    });

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("=== PROFILE API ERROR ===", error);
    return res.status(500).json({
      profile: null,
      game: null,
      error: true,
      message: error.message || "An unknown error occurred",
      timestamp: new Date().toISOString(),
    });
  }
}
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Disable unauthorized TLS checks for environments with proxy/cert issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Secrets loaded from environment variables (set in .env locally or Vercel dashboard)
const BOT_TOKEN = process.env.BOT_TOKEN;
const RESULTS_CHANNEL_ID = process.env.RESULTS_CHANNEL_ID || '1506995570068291804';
const GUILD_ID = process.env.GUILD_ID || '1456890583254564948';
const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID || '1456894990897647648';

if (!BOT_TOKEN) {
  console.error('[ERROR] BOT_TOKEN environment variable is not set!');
  console.error('Create a .env file or set the variable in your Vercel dashboard.');
}

const CACHE_FILE = path.join(__dirname, 'user_cache.json');

// Helper to load cache
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading cache:', e);
  }
  return {};
}

// Helper to save cache
function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving cache:', e);
  }
}

// Map sub-tiers to official main tiers
const TIER_MAPPING = {
  'HT1': { group: 'T1 Supreme', class: 'tier-t1', weight: 10 },
  'LT1': { group: 'T1 Supreme', class: 'tier-t1', weight: 9 },
  'HT2': { group: 'T2 Advanced', class: 'tier-t2', weight: 8 },
  'LT2': { group: 'T2 Advanced', class: 'tier-t2', weight: 7 },
  'HT3': { group: 'T3 Beginner+', class: 'tier-t3', weight: 6 },
  'LT3': { group: 'T3 Beginner+', class: 'tier-t3', weight: 5 },
  'HT4': { group: 'T4 Casual', class: 'tier-t4', weight: 4 },
  'LT4': { group: 'T4 Casual', class: 'tier-t4', weight: 3 },
  'HT5': { group: 'T5 Developing', class: 'tier-t5', weight: 2 },
  'LT5': { group: 'T5 Developing', class: 'tier-t5', weight: 1 }
};

// Fetch user profile from Discord (with caching)
async function getDiscordUser(userId, cache) {
  if (cache[userId]) {
    const entry = cache[userId];
    if (Date.now() - entry.cachedAt < 24 * 60 * 60 * 1000) {
      return entry.data;
    }
  }

  try {
    console.log(`[Discord API] Fetching user profile for: ${userId}`);
    const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      cache[userId] = {
        cachedAt: Date.now(),
        data: {
          username: data.username,
          global_name: data.global_name || data.username,
          avatar: data.avatar
        }
      };
      saveCache(cache);
      return cache[userId].data;
    } else {
      console.warn(`[Discord API] Failed to fetch user ${userId}: ${res.status}`);
    }
  } catch (error) {
    console.error(`[Discord API] Error fetching user ${userId}:`, error);
  }

  return cache[userId] ? cache[userId].data : {
    username: `user_${userId.slice(-6)}`,
    global_name: `Unknown Player`,
    avatar: null
  };
}

// Leaders cache
let cachedLeaderboard = null;
let leaderboardCacheTime = 0;

// Endpoint to get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
  const now = Date.now();
  if (cachedLeaderboard && (now - leaderboardCacheTime < 10000)) {
    return res.json(cachedLeaderboard);
  }

  try {
    console.log('[API] Fetching leaderboard results from Discord...');
    const discordRes = await fetch(`https://discord.com/api/v10/channels/${RESULTS_CHANNEL_ID}/messages?limit=100`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    });

    if (!discordRes.ok) {
      return res.status(500).json({ error: 'Failed to retrieve messages from Discord channel' });
    }

    const messages = await discordRes.json();
    const userCache = loadCache();
    const uniquePlayers = new Map();

    const regex = /<@(\d+)>\s+has\s+been\s+placed\s+at\s+\*\*([^*]+)\*\*/i;

    for (const msg of messages) {
      if (msg.embeds && msg.embeds.length > 0) {
        for (const embed of msg.embeds) {
          if (embed.title === 'Bedfight — Tier Result' && embed.description) {
            const match = embed.description.match(regex);
            if (match) {
              const userId = match[1];
              const tierRaw = match[2].trim().toUpperCase();

              if (!uniquePlayers.has(userId)) {
                uniquePlayers.set(userId, {
                  userId,
                  tierRaw,
                  timestamp: embed.timestamp || msg.timestamp
                });
              }
            }
          }
        }
      }
    }

    const leaderboard = [];
    for (const [userId, player] of uniquePlayers.entries()) {
      const userInfo = await getDiscordUser(userId, userCache);
      const tierInfo = TIER_MAPPING[player.tierRaw] || { group: 'Unranked', class: 'tier-unranked', weight: 0 };

      let avatarUrl = '';
      if (userInfo.avatar) {
        const isGif = userInfo.avatar.startsWith('a_');
        avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.${isGif ? 'gif' : 'png'}?size=64`;
      } else {
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
      }

      leaderboard.push({
        userId,
        username: userInfo.username,
        displayName: userInfo.global_name,
        avatarUrl,
        tierRaw: player.tierRaw,
        tierGroup: tierInfo.group,
        tierClass: tierInfo.class,
        weight: tierInfo.weight,
        timestamp: player.timestamp
      });
    }

    leaderboard.sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    cachedLeaderboard = { success: true, count: leaderboard.length, data: leaderboard };
    leaderboardCacheTime = now;
    res.json(cachedLeaderboard);
  } catch (error) {
    console.error('[API] Error building leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Staff cache
let cachedStaff = null;
let staffCacheTime = 0;

// Endpoint to get staff members
app.get('/api/staff', async (req, res) => {
  const now = Date.now();
  // Changed staff list cache to 10 seconds to support a live staff list experience
  if (cachedStaff && (now - staffCacheTime < 10000)) {
    return res.json(cachedStaff);
  }

  try {
    console.log('[API] Fetching guild members from Discord...');
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guild members: ${response.status}`);
    }

    const members = await response.json();
    const staffMembers = members.filter(m => m.roles.includes(STAFF_ROLE_ID));

    const staffList = staffMembers.map(m => {
      // Map mock statuses: make some online, idle, offline
      const statuses = ['online', 'idle', 'offline'];
      
      // Seed a pseudo-random value based on current time (changes status mock every 1.5 mins) to make statuses dynamic!
      const timeOffset = Math.floor(Date.now() / 90000);
      const statusIdx = (parseInt(m.user.id.slice(-3)) + timeOffset) % 3;
      let status = statuses[statusIdx];
      
      // Force specific staff online/active for visual demo
      if (m.user.username.includes('raghvr') || m.user.username.includes('hasty') || m.user.username.includes('suam')) {
        status = 'online';
      }

      let avatarUrl = '';
      if (m.user.avatar) {
        const isGif = m.user.avatar.startsWith('a_');
        avatarUrl = `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.${isGif ? 'gif' : 'png'}?size=64`;
      } else {
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(m.user.id) % 5}.png`;
      }

      return {
        userId: m.user.id,
        username: m.user.username,
        displayName: m.nick || m.user.global_name || m.user.username,
        avatarUrl,
        status
      };
    });

    // Sort: Online first, then Idle, then Offline
    const statusWeight = { 'online': 2, 'idle': 1, 'offline': 0 };
    staffList.sort((a, b) => statusWeight[b.status] - statusWeight[a.status]);

    cachedStaff = { success: true, count: staffList.length, data: staffList };
    staffCacheTime = now;
    res.json(cachedStaff);
  } catch (error) {
    console.error('[API] Error fetching staff list:', error);
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
});

// Fallback for SPA routing: serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Local dev server
app.listen(PORT, () => {
  console.log(`Mineville Zeqa Bedfight server running on http://localhost:${PORT}`);
});

// Export for Vercel serverless
module.exports = app;

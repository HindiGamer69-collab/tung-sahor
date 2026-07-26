// Client-side router & page renderer
const viewContainer = document.getElementById('app-view');
let leaderboardPollInterval = null;
let staffPollInterval = null;

const routes = {
  '/home': renderHome,
  '/about': renderAbout,
  '/leaderboard': renderLeaderboard,
  '/guide': renderGuide,
  '/tournaments': renderTournaments
};

function router() {
  // Clear active intervals when switching pages
  if (leaderboardPollInterval) {
    clearInterval(leaderboardPollInterval);
    leaderboardPollInterval = null;
  }
  
  closeStaffDrawer(); // Close the staff drawer if open when changing routes

  const hash = window.location.hash || '#/home';
  const path = hash.substring(1) || '/home';
  
  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHash = link.getAttribute('href');
    if (linkHash === hash || (hash === '#/home' && linkHash === '#/home')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const renderer = routes[path] || renderHome;
  renderer();
  
  // Scroll to top on page load
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Initial Routing
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- PAGE RENDERERS ---

function renderHome() {
  viewContainer.innerHTML = `
    <section class="hero">
      <img src="/assets/logo.png" alt="Mineville Zeqa Bedwars Logo" class="hero-logo">
      <h1 class="hero-title">Mineville Zeqa Bedfight</h1>
      <p class="hero-subtitle">
        Welcome to the official Mineville Zeqa Bedfight portal. Test your skills, climb the competitive tier list, and dominate the leaderboard!
      </p>
      <div class="hero-actions">
        <a href="https://discord.gg/Rb2Wwfft4Z" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor" style="margin-right: 4px;"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.29,79,79,0,0,0,6.85-11.15,68.8,68.8,0,0,1-10.75-5.18c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,70.72,0c.85.71,1.74,1.39,2.65,2a68.68,68.68,0,0,1-10.75,5.18,79,79,0,0,0,6.85,11.15,105.53,105.53,0,0,0,32-16.29C129.66,48.24,123.39,25.42,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
          Join Discord Server
        </a>
      </div>
    </section>

    <!-- Scroll Grid section -->
    <div class="scroll-section">
      <div class="scroll-subtitle">Ranks, rules, staff, tournaments, and more.</div>
      
      <div class="portal-grid">
        <!-- Tournaments Page Link -->
        <a href="#/tournaments" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.24 1.81 4.07 4 4.3V18c0 .83.67 1.5 1.5 1.5H9v2h6v-2h1.5c.83 0 1.5-.67 1.5-1.5v-3.7c2.19-.23 4-2.06 4-4.3V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 .8-.5 1.5-1.2 1.8-.5-.4-.8-1-.8-1.8zm14 0c0 .8-.3 1.4-.8 1.8-.7-.3-1.2-1-1.2-1.8V7h2v3z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Tournaments</span>
            <span class="portal-card-desc">Brackets & live events</span>
          </div>
        </a>

        <!-- Leaderboard Page Link -->
        <a href="#/leaderboard" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Leaderboard</span>
            <span class="portal-card-desc">All gamemode ranks</span>
          </div>
        </a>

        <!-- Guide Page Link -->
        <a href="#/guide" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.2 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Guide</span>
            <span class="portal-card-desc">Tier testing help</span>
          </div>
        </a>

        <!-- Rules (Discord Link) -->
        <a href="https://discord.gg/Rb2Wwfft4Z" target="_blank" rel="noopener noreferrer" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Rules</span>
            <span class="portal-card-desc">Rules & guide</span>
          </div>
        </a>

        <!-- Apply (Discord Link) -->
        <a href="https://discord.gg/Rb2Wwfft4Z" target="_blank" rel="noopener noreferrer" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Apply</span>
            <span class="portal-card-desc">Staff applications</span>
          </div>
        </a>

        <!-- Discord (Discord Link) -->
        <a href="https://discord.gg/Rb2Wwfft4Z" target="_blank" rel="noopener noreferrer" class="portal-card discord-card">
          <div class="portal-icon-container discord-box">
            <svg class="portal-icon discord-icon" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.95,54.65,1,77.53a105.53,105.53,0,0,0,32,16.29,79,79,0,0,0,6.85-11.15,68.8,68.8,0,0,1-10.75-5.18c.91-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,70.72,0c.85.71,1.74,1.39,2.65,2a68.68,68.68,0,0,1-10.75,5.18,79,79,0,0,0,6.85,11.15,105.53,105.53,0,0,0,32-16.29C129.66,48.24,123.39,25.42,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Discord</span>
            <span class="portal-card-desc">Queue for a tier test</span>
          </div>
        </a>

        <!-- Report (Discord Link) -->
        <a href="https://discord.gg/Rb2Wwfft4Z" target="_blank" rel="noopener noreferrer" class="portal-card">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Report</span>
            <span class="portal-card-desc">Report a member</span>
          </div>
        </a>

        <!-- Staff List (Opens Sidebar Drawer) -->
        <a href="#" class="portal-card" id="staff-list-btn">
          <div class="portal-icon-container">
            <svg class="portal-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <div class="portal-card-info">
            <span class="portal-card-title">Staff List</span>
            <span class="portal-card-desc">View online staff team</span>
          </div>
        </a>
      </div>
    </div>
  `;
}

function renderAbout() {
  viewContainer.innerHTML = `
    <div class="section-title-wrap">
      <div class="section-domain">Information</div>
      <h1 class="section-title">Mineville Zeqa Bedfight Tiers</h1>
      <p class="section-desc">Learn about our mission, tier systems, and rules.</p>
    </div>

    <!-- About Section Content -->
    <div class="card-container about-card">
      <div class="about-section-block">
        <h2 class="about-heading">About Us</h2>
        <p class="about-paragraph">
          Mineville Zeqa Bedfight Tiers is a community dedicated exclusively to competitive Bedfight tier testing on Mineville Zeqa. 
          We are focused on providing fair, accurate, and consistent Bedfight tier tests for players who want to measure their skill 
          and improve in competitive Bedfight. We do not offer tier testing for any other gamemode.
        </p>
      </div>

      <div class="about-section-block">
        <h2 class="about-heading">Our Goal</h2>
        <p class="about-paragraph">
          Our goal is to maintain a trustworthy and competitive environment where every player is tested using the same standards. 
          We aim to ensure that every tier reflects a player's actual Bedfight ability.
        </p>
      </div>

      <div class="about-section-block">
        <h2 class="about-heading">What We Offer</h2>
        <ul class="about-list">
          <li>Professional Bedfight Tier Testing</li>
          <li>Skilled and experienced Tier Testers</li>
          <li>Fair and unbiased evaluations</li>
          <li>Competitive community events</li>
          <li>Active staff support</li>
        </ul>
      </div>

      <div class="about-section-block">
        <h2 class="about-heading">Tier System</h2>
        <p class="about-paragraph">
          Players are ranked based on their overall Bedfight performance, including:
        </p>
        <ul class="about-list">
          <li>PvP Skill</li>
          <li>Game Sense</li>
          <li>Movement</li>
          <li>Block Placement</li>
          <li>Clutch Ability</li>
          <li>Consistency</li>
        </ul>
        <div class="tier-flow-box">
          <span class="tier-flow-label">Available Tiers:</span>
          <div class="tier-flow-line">
            <span class="tier-flow-badge t5">LT5</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t5">LT4</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t3">LT3</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t3">LT2</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t2">LT1</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t5">HT5</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t5">HT4</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t3">HT3</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t3">HT2</span>
            <span class="tier-arrow">&rarr;</span>
            <span class="tier-flow-badge t1">HT1</span>
          </div>
        </div>
      </div>

      <div class="about-section-block">
        <h2 class="about-heading warning-heading">Rules</h2>
        <ul class="about-list bullet-cross">
          <li>Respect all members and staff.</li>
          <li>Follow instructions given by Tier Testers.</li>
          <li>Cheating, exploiting, or using unfair advantages is strictly prohibited.</li>
          <li>Toxic behavior, harassment, or excessive arguing will not be tolerated.</li>
          <li>All tests are final unless a retest is approved by management.</li>
        </ul>
      </div>

      <div class="about-section-block info-block">
        <h2 class="about-heading">Server Information</h2>
        <div class="info-grid">
          <div class="info-item"><strong>Server:</strong> <span>Mineville Zeqa</span></div>
          <div class="info-item"><strong>Gamemode:</strong> <span>Bedfight Only</span></div>
          <div class="info-item"><strong>Platform:</strong> <span>Minecraft Bedrock Edition</span></div>
          <div class="info-item"><strong>Testing Type:</strong> <span>Competitive Bedfight Tier Testing</span></div>
        </div>
      </div>
      
      <p class="about-footer-thank">
        Thank you for being part of Mineville Zeqa Bedfight Tiers. We strive to provide a fair and competitive environment for every player.
      </p>
    </div>
  `;
}

async function renderLeaderboard() {
  viewContainer.innerHTML = `
    <div class="section-title-wrap">
      <div class="section-domain">Competitive</div>
      <h1 class="section-title">Official Leaderboard</h1>
      <p class="section-desc">Real-time Bedfight ranks verified directly via Discord bot command submissions.</p>
    </div>
    
    <div class="card-container" id="leaderboard-card">
      <div class="loading-container">
        <div class="spinner"></div>
      </div>
    </div>
  `;

  // Fetch initial leaderboard standings
  await fetchLeaderboardData();

  // Setup active polling every 10 seconds to auto-update in real-time when staff run /resultbedfight
  leaderboardPollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.data) {
          updateLeaderboardTable(responseData.data);
        }
      }
    } catch (e) {
      console.error('Error polling leaderboard:', e);
    }
  }, 10000);
}

async function fetchLeaderboardData() {
  const container = document.getElementById('leaderboard-card');
  try {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('API Error');
    const responseData = await res.json();
    
    if (responseData.success && responseData.data && responseData.data.length > 0) {
      updateLeaderboardTable(responseData.data);
    } else {
      container.innerHTML = `
        <div class="status-state">
          <div class="status-icon">🏆</div>
          <h3 class="status-title">No Results Yet</h3>
          <p class="status-desc">No tier test results have been registered in the channel yet. Submit a result using /resultbedfight in the Discord server!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    container.innerHTML = `
      <div class="status-state">
        <div class="status-icon">❌</div>
        <h3 class="status-title">Error Loading Leaderboard</h3>
        <p class="status-desc">Unable to retrieve rankings at this time. Please make sure the backend server is running and connected to Discord.</p>
      </div>
    `;
  }
}

function updateLeaderboardTable(data) {
  const container = document.getElementById('leaderboard-card');
  if (!container) return;

  let rowsHtml = '';
  data.forEach((p, index) => {
    let rankClass = '';
    if (index === 0) rankClass = 'rank-top-1';
    else if (index === 1) rankClass = 'rank-top-2';
    else if (index === 2) rankClass = 'rank-top-3';

    const displayBadgeGroup = p.tierGroup || 'Unranked';

    let badgeColorClass = 't5';
    if (displayBadgeGroup.includes('T1')) badgeColorClass = 't1';
    else if (displayBadgeGroup.includes('T2')) badgeColorClass = 't2';
    else if (displayBadgeGroup.includes('T3')) badgeColorClass = 't3';
    else if (displayBadgeGroup.includes('T4')) badgeColorClass = 't4';

    rowsHtml += `
      <tr>
        <td class="rank-col ${rankClass}">#${index + 1}</td>
        <td>
          <div class="player-col">
            <img src="${p.avatarUrl}" alt="${p.displayName}" class="player-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
            <div class="player-names">
              <span class="player-disp">${escapeHtml(p.displayName)}</span>
              <span class="player-user">@${escapeHtml(p.username)}</span>
            </div>
          </div>
        </td>
        <td class="badge-cell">
          <span class="tier-badge ${badgeColorClass}">${escapeHtml(p.tierRaw)}</span>
        </td>
        <td>
          <span class="tier-name">${escapeHtml(displayBadgeGroup)}</span>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="leaderboard-table-wrap">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th class="rank-col">Rank</th>
            <th>Player</th>
            <th>Tier Rank</th>
            <th>Tier Group</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

function renderGuide() {
  viewContainer.innerHTML = `
    <div class="section-title-wrap">
      <h1 class="section-title">Tier Testing Guide</h1>
      <p class="section-desc">Everything you need to know about tier testing on Mineville ZEQA Bedwars — from joining the queue to earning your rank.</p>
    </div>

    <!-- Tier List Card -->
    <div class="card-container">
      <h2 class="card-title">Tier List</h2>
      <div class="tier-list">
        <div class="tier-item tier-t1">
          <div class="tier-meta">
            <span class="tier-badge t1">T1</span>
            <span class="tier-name">Supreme</span>
          </div>
        </div>
        <div class="tier-item tier-t2">
          <div class="tier-meta">
            <span class="tier-badge t2">T2</span>
            <span class="tier-name">Advanced</span>
          </div>
        </div>
        <div class="tier-item tier-t3">
          <div class="tier-meta">
            <span class="tier-badge t3">T3</span>
            <span class="tier-name">Beginner+</span>
          </div>
        </div>
        <div class="tier-item tier-t4">
          <div class="tier-meta">
            <span class="tier-badge t4">T4</span>
            <span class="tier-name">Casual</span>
          </div>
        </div>
        <div class="tier-item tier-t5">
          <div class="tier-meta">
            <span class="tier-badge t5">T5</span>
            <span class="tier-name">Developing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- How Tier Testing Works -->
    <div class="card-container">
      <h2 class="card-title">❓ How Tier Testing Works</h2>
      <div class="steps-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-text">Join our discord server and navigate to the <strong>#Request-test</strong> channel.</div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-text">Click on <strong>The Request Test</strong> Button and fill the form.</div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-text">Wait for a tier tester to reply.</div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div class="step-text">Play 5 Bedfight Games (First to win) against the Tester.</div>
        </div>
        <div class="step-item">
          <div class="step-num">5</div>
          <div class="step-text">The Tester will submit your result using <strong>/resultbedfight</strong> — your rank is assigned.</div>
        </div>
        <div class="step-item">
          <div class="step-num">6</div>
          <div class="step-text">Your rank appears on the leaderboard within minutes.</div>
        </div>
      </div>
    </div>

    <!-- Rules Box -->
    <div class="rules-box">
      <h3 class="rules-title">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        Rules During Testing
      </h3>
      <ul class="rules-list">
        <li>Do not request the tester to wait in the game.</li>
        <li>Do not use Hacks and cheats otherwise you will be blacklisted.</li>
        <li>Respect the Tester and other players at all times.</li>
        <li>Do not disconnect intentionally — counts as a loss.</li>
        <li>Results are final — No appeal unless evidence of rules-breaking.</li>
      </ul>
    </div>

    <!-- Frequently Asked Questions -->
    <div class="card-container">
      <h2 class="card-title">Frequently Asked Questions</h2>
      <div class="accordion">
        <div class="accordion-item">
          <div class="accordion-header">
            <span>How long does a tier test take?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              A tier test usually takes around 15–30 minutes. It consists of playing a best-of-5 series (first to 3 wins) against one of our official testers.
            </div>
          </div>
        </div>
        
        <div class="accordion-item">
          <div class="accordion-header">
            <span>Can I retake my tier test?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              Yes, you can request a re-test, but there is a cooldown of 7 days between tests to prevent spamming and allow you time to practice.
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <span>What server do we play on?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              All tests are played on the Zeqa Network Minecraft server (IP: <strong>zeqa.net</strong> or <strong>play.zeqa.net</strong>).
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <span>What happens if the tester disconnects?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              If a tester disconnects, the match will be paused. The tester will rejoin and resume the test. If you disconnect, it may count as a loss unless there is a valid reason.
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <span>Can I choose my tester?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              No, testers are assigned automatically based on availability when you open a ticket. All of our testers are highly qualified.
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <div class="accordion-header">
            <span>What gamemode is used for testing?</span>
            <svg class="accordion-icon" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              The standard Bedfight 1v1 gamemode is used for testing. It includes standard bedwars gear and mechanics.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  setupAccordion();
}

function renderTournaments() {
  viewContainer.innerHTML = `
    <div class="section-title-wrap">
      <div class="section-domain">Events</div>
      <h1 class="section-title">Tournaments</h1>
      <p class="section-desc">Official tournaments and seasonal events.</p>
    </div>
    
    <div class="card-container tournament-alert-card">
      <div class="tournament-icon">
        <svg viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.24 1.81 4.07 4 4.3V18c0 .83.67 1.5 1.5 1.5H9v2h6v-2h1.5c.83 0 1.5-.67 1.5-1.5v-3.7c2.19-.23 4-2.06 4-4.3V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 .8-.5 1.5-1.2 1.8-.5-.4-.8-1-.8-1.8zm14 0c0 .8-.3 1.4-.8 1.8-.7-.3-1.2-1-1.2-1.8V7h2v3z"/></svg>
      </div>
      <h3 class="status-title">No Tournament Active</h3>
      <p class="status-desc">No tournament is going on right now. Check back later or follow our announcements on Discord for upcoming events!</p>
    </div>
  `;
}

// --- STAFF LIST DRAWER HANDLERS ---

async function openStaffDrawer() {
  const drawer = document.getElementById('staff-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const container = document.getElementById('staff-list-container');
  
  // Show drawer and overlay
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Disable scroll under drawer
  
  // Show spinner initially
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
    </div>
  `;
  
  // Perform initial fetch
  await fetchAndRenderStaff();
  
  // Setup dynamic live polling: poll every 10 seconds while the drawer is open
  if (staffPollInterval) clearInterval(staffPollInterval);
  staffPollInterval = setInterval(async () => {
    console.log('[Staff Live Poll] Updating staff online statuses...');
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.success && responseData.data) {
          updateStaffListContainer(responseData.data);
        }
      }
    } catch (e) {
      console.error('Error polling live staff statuses:', e);
    }
  }, 10000);
}

async function fetchAndRenderStaff() {
  const container = document.getElementById('staff-list-container');
  try {
    const res = await fetch('/api/staff');
    if (!res.ok) throw new Error('API Error');
    const responseData = await res.json();
    
    if (responseData.success && responseData.data && responseData.data.length > 0) {
      updateStaffListContainer(responseData.data);
    } else {
      container.innerHTML = `
        <div class="status-state">
          <div class="status-icon">👥</div>
          <h4 class="status-title">No Staff Found</h4>
          <p class="status-desc">No active staff members with the specified role were found.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching staff list:', error);
    container.innerHTML = `
      <div class="status-state">
        <div class="status-icon">❌</div>
        <h4 class="status-title">Error Loading Staff</h4>
        <p class="status-desc">Unable to load the staff list. Please try again later.</p>
      </div>
    `;
  }
}

function updateStaffListContainer(data) {
  const container = document.getElementById('staff-list-container');
  if (!container) return;
  
  let membersHtml = '<div class="staff-list">';
  data.forEach(m => {
    let statusText = 'Offline';
    if (m.status === 'online') statusText = 'Online';
    else if (m.status === 'idle') statusText = 'Idle';
    
    membersHtml += `
      <div class="staff-member">
        <div class="staff-avatar-wrap">
          <img src="${m.avatarUrl}" alt="${m.displayName}" class="staff-avatar" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
          <span class="status-indicator status-${m.status}" title="${statusText}"></span>
        </div>
        <div class="staff-info">
          <div class="staff-name-wrap">
            <span class="staff-display-name">${escapeHtml(m.displayName)}</span>
            <span class="staff-username">@${escapeHtml(m.username)}</span>
          </div>
          <span class="staff-status-text status-text-${m.status}">${statusText}</span>
        </div>
      </div>
    `;
  });
  membersHtml += '</div>';
  container.innerHTML = membersHtml;
}

function closeStaffDrawer() {
  const drawer = document.getElementById('staff-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = ''; // Re-enable background scroll
  
  // Clear live staff polling when drawer is closed
  if (staffPollInterval) {
    clearInterval(staffPollInterval);
    staffPollInterval = null;
    console.log('[Staff Live Poll] Stopped.');
  }
}

// Global click delegation for dynamically rendered elements
document.addEventListener('click', (e) => {
  // Staff list card click handler
  const staffBtn = e.target.closest('#staff-list-btn');
  if (staffBtn) {
    e.preventDefault();
    openStaffDrawer();
    return;
  }
  
  // Close drawer handlers
  const closeBtn = e.target.closest('#close-drawer-btn');
  const overlay = e.target.closest('#drawer-overlay');
  if (closeBtn || overlay) {
    closeStaffDrawer();
    return;
  }
});

// --- HELPERS ---

function setupAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

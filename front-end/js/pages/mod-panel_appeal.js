/**
 * NexusHub — Moderator Review Panel Logic
 * Handles rapid report triage, user history lookup, and hotkey actions.
 */

// ==========================================
// 1. DATA & STATE
// ==========================================
const MOCK_REPORTS = [
    { id: '#4821', user: 'BadActor_X', channel: '#general', reason: 'Hate Speech or Discrimination', violations: 3 },
    { id: '#4820', user: 'SpamBot99', channel: '#frontend', reason: 'Spam / Self-promotion', violations: 1 },
    { id: '#4819', user: 'TrollX_420', channel: '#code-review', reason: 'Harassment', violations: 2 },
    { id: '#4818', user: 'NewUser_874', channel: '#general', reason: 'Misinformation', violations: 0 },
    { id: '#4817', user: 'DarkRaider', channel: '#off-topic', reason: 'NSFW Content', violations: 5 },
    { id: '#4816', user: 'GhostHacker', channel: '#devops', reason: 'Other Rule Violation', violations: 0 },
    { id: '#4815', user: 'FakeNews_Bot', channel: '#announcements', reason: 'Misinformation', violations: 1 },
    { id: '#4814', user: 'MemeRaider_7', channel: '#introductions', reason: 'Spam', violations: 0 },
];

const ACTION_MAP = {
    'w': { type: 'warn', icon: '⚠️', msg: 'Warning issued to user' },
    'm': { type: 'mute', icon: '🔇', msg: 'User muted for selected duration' },
    'b': { type: 'ban7', icon: '🚫', msg: '7-day ban applied' },
    'p': { type: 'banperm', icon: '⛔', msg: 'Permanent ban applied' },
    'd': { type: 'dismiss', icon: '✅', msg: 'Report dismissed' },
    'e': { type: 'escalate', icon: '🔺', msg: 'Escalated to Admin' }
};

// ==========================================
// 2. QUEUE & SELECTION
// ==========================================

window.selectReport = function(el, idx) {
    // UI: Update Queue Selection
    document.querySelectorAll('.report-item').forEach(r => r.classList.remove('active'));
    el.classList.add('active');

    // Remove unread indicator
    const unreadDot = el.querySelector('.ri-unread-dot');
    if (unreadDot) unreadDot.remove();

    // Data: Update Detail Panel
    const report = MOCK_REPORTS[idx];
    const titleEl = document.getElementById('dpTitle');
    if (titleEl) {
        titleEl.textContent = `Report ${report.id} — ${report.user} in ${report.channel}`;
    }

    // Reset center tabs to "Content"
    const firstTab = document.querySelector('.dp-tab');
    if (firstTab) window.setDpTab(firstTab, 'content');

    // Update Accused Stats in Right Panel
    updateAccusedProfile(report);
};

function updateAccusedProfile(report) {
    const nameEl = document.querySelector('.acc-name');
    const violEl = document.querySelector('.acc-stat-val');
    if (nameEl) nameEl.textContent = report.user;
    if (violEl) violEl.textContent = report.violations;
    
    // Toggle repeat offender warning
    const repeatWarning = document.querySelector('.repeat-warning');
    if (repeatWarning) {
        repeatWarning.style.display = report.violations >= 3 ? 'block' : 'none';
    }
}

window.setQTab = function(el) {
    document.querySelectorAll('.qp-tab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');
    window.toast(`Queue filtered: ${el.textContent}`);
};

// ==========================================
// 3. DETAIL PANEL NAVIGATION
// ==========================================

window.setDpTab = function(el, tabName) {
    // UI: Tab Active State
    document.querySelectorAll('.dp-tab').forEach(t => t.classList.remove('on'));
    el.classList.add('on');

    // Content: Switch visibility
    const content = document.getElementById('tabContent');
    const history = document.getElementById('tabHistory');
    const previous = document.getElementById('tabPrevious');

    if (content) content.style.display = tabName === 'content' ? 'block' : 'none';
    if (history) history.style.display = tabName === 'history' ? 'block' : 'none';
    if (previous) previous.style.display = tabName === 'previous' ? 'block' : 'none';
};

// ==========================================
// 4. MODERATION ACTIONS
// ==========================================

window.setMute = function(el) {
    document.querySelectorAll('.mute-opt').forEach(o => o.classList.remove('on'));
    el.classList.add('on');
};

window.takeAction = function(actionType) {
    const action = Object.values(ACTION_MAP).find(a => a.type === actionType) 
                   || { icon: '⚙️', msg: 'Action processed' };
    
    window.showToast(action.icon, action.msg);
    console.log(`Mod Action: ${actionType} triggered.`);
};

window.resolveReport = function() {
    window.showToast('✅', 'Report resolved. Fetching next item...');
    
    const currentActive = document.querySelector('.report-item.active');
    if (currentActive) {
        // Mock the removal/resolution
        setTimeout(() => {
            currentActive.style.opacity = '0.4';
            currentActive.style.pointerEvents = 'none';
            currentActive.style.filter = 'grayscale(1)';
            
            // Auto-select next item if available
            const nextItem = currentActive.nextElementSibling;
            if (nextItem) {
                nextItem.click();
            }
        }, 600);
    }
};

// ==========================================
// 5. KEYBOARD SHORTCUTS
// ==========================================

function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if moderator is typing in a textarea/input
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

        const key = e.key.toLowerCase();
        if (ACTION_MAP[key]) {
            e.preventDefault();
            window.takeAction(ACTION_MAP[key].type);
        }
        
        // "Enter" to resolve and move to next
        if (e.key === 'Enter') {
            window.resolveReport();
        }
    });
}

// ==========================================
// 6. UTILITIES & INIT
// ==========================================

window.showToast = function(icon, msg) {
    const t = document.getElementById('toast');
    const tIcon = document.getElementById('toastIcon');
    const tMsg = document.getElementById('toastMsg');

    if (t && tIcon && tMsg) {
        tIcon.textContent = icon;
        tMsg.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2800);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupHotkeys();
    
    // Initial UI Setup: Hide history/prior tabs
    const history = document.getElementById('tabHistory');
    const previous = document.getElementById('tabPrevious');
    if (history) history.style.display = 'none';
    if (previous) previous.style.display = 'none';

    console.log("Moderator Review Panel active. Hotkeys enabled (W, M, B, P, D, E).");
});
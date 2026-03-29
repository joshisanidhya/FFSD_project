/**
 * NexusHub — Community Manager Logic
 * Manages view switching, member/channel filtering, and dynamic growth charts.
 */

// ==========================================
// 1. STATE & CONSTANTS
// ==========================================
const GROWTH_DATA = [12, 8, 18, 6, 14, 22, 16];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ==========================================
// 2. VIEW MANAGEMENT
// ==========================================

/**
 * Switches the active view in the manager panel
 * @param {string} viewId - The ID suffix (e.g., 'overview')
 * @param {HTMLElement} navEl - The navigation item clicked
 */
window.switchView = function(viewId, navEl) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Deactivate all nav items
    document.querySelectorAll('.ln-item').forEach(i => i.classList.remove('active'));
    
    // Activate target
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    if (navEl) {
        navEl.classList.add('active');
    }

    // Special logic for specific views
    if (viewId === 'overview') {
        renderGrowthChart(); // Re-render to ensure animations trigger
    }
    
    console.log(`Switched to manager view: ${viewId}`);
};

// ==========================================
// 3. CHANNEL & MEMBER MANAGEMENT
// ==========================================

window.showModal = () => document.getElementById('modalBg').classList.add('show');
window.closeModal = () => document.getElementById('modalBg').classList.remove('show');

window.createChannel = function() {
    const input = document.getElementById('chNameInput');
    const name = input.value.trim() || 'new-channel';
    
    window.closeModal();
    window.toast(`✅ #${name.toLowerCase().replace(/\s+/g, '-')} created successfully!`);
    input.value = '';
};

window.confirmDelete = function(name) {
    // Using a custom confirm or standard browser confirm
    if (confirm(`Are you sure you want to delete #${name}? All message history will be lost.`)) {
        window.toast(`🗑 #${name} has been deleted.`);
    }
};

/**
 * Generic Table Filtering
 */
window.filterChannels = (query) => filterTable('chBody', query);
window.filterMembers = (query) => filterTable('memBody', query);

function filterTable(tbodyId, query) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    const q = query.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
}

// ==========================================
// 4. ROLES & PERMISSIONS
// ==========================================

window.selectRole = function(el, roleName) {
    // UI selection
    document.querySelectorAll('.role-item').forEach(r => r.classList.remove('active'));
    el.classList.add('active');
    
    // Update Header
    const editorTitle = document.getElementById('roleEditorName');
    if (editorTitle) editorTitle.textContent = `${roleName} Permissions`;

    // Simulate permission loading
    const toggles = document.querySelectorAll('.toggle');
    toggles.forEach((t, index) => {
        // Owner (index 0 logic) gets everything, Guest gets nothing
        if (roleName === 'Owner') t.classList.add('on');
        else if (roleName === 'Guest') t.classList.remove('on');
        else {
            // Randomize for Moderator/Member for visual variety in prototype
            t.classList.toggle('on', Math.random() > 0.4);
        }
    });
};

// ==========================================
// 5. DATA VISUALIZATION
// ==========================================

function renderGrowthChart() {
    const wrap = document.getElementById('growthChart');
    if (!wrap) return;
    
    // Clear existing
    wrap.innerHTML = '';
    
    const max = Math.max(...GROWTH_DATA);
    
    GROWTH_DATA.forEach((val, i) => {
        const col = document.createElement('div');
        col.className = 'chart-col';
        col.style.cssText = `flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height: 100%; position:relative;`;
        
        const bar = document.createElement('div');
        const pct = (val / max) * 100;
        
        // Styling logic for the current day (last item)
        const isCurrent = i === GROWTH_DATA.length - 1;
        const barBg = isCurrent 
            ? 'linear-gradient(180deg, var(--accent), var(--accent-light))' 
            : 'rgba(91, 110, 245, 0.2)';

        bar.style.cssText = `
            width: 80%; 
            border-radius: 4px 4px 0 0; 
            background: ${barBg}; 
            height: 0%; 
            transition: height 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67);
            cursor: pointer;
        `;
        
        bar.title = `${val} new members`;
        
        const label = document.createElement('div');
        label.style.cssText = `font-size: 10px; color: var(--text-3); margin-top: auto;`;
        label.textContent = DAYS[i];

        const valLabel = document.createElement('div');
        valLabel.style.cssText = `font-size: 10px; font-weight: 600; color: var(--text-2);`;
        valLabel.textContent = val;

        col.appendChild(valLabel);
        col.appendChild(bar);
        col.appendChild(label);
        wrap.appendChild(col);

        // Trigger animation
        setTimeout(() => { bar.style.height = pct + '%'; }, 50 * i);
    });
}

// ==========================================
// 6. UTILITIES
// ==========================================

window.toast = function(msg) {
    const t = document.getElementById('toast');
    const m = document.getElementById('toastMsg');
    if (!t || !m) return;
    
    m.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
};

// ==========================================
// 7. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderGrowthChart();
    
    // Close modal on background click
    const modalBg = document.getElementById('modalBg');
    if (modalBg) {
        modalBg.addEventListener('click', (e) => {
            if (e.target === modalBg) window.closeModal();
        });
    }

    console.log("Community Manager Panel initialized.");
});
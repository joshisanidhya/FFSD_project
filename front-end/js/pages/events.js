/**
 * NexusHub — Events Module Logic
 * Handles event discovery filtering, registration states, and the creation wizard.
 */

// ==========================================
// 1. STATE & CONFIG
// ==========================================
let currentActiveTab = 'upcoming';
let activeFilter = 'all';

// ==========================================
// 2. TAB & VIEW NAVIGATION
// ==========================================

/**
 * Switches between Upcoming, Registered, and Create views
 */
window.switchTab = function(name, btn) {
    // UI: Tab Buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // UI: Content Areas
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    const targetContent = document.getElementById('tab-' + name);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    currentActiveTab = name;
    console.log(`Switched to Events tab: ${name}`);
};

// ==========================================
// 3. FILTERING & DISCOVERY
// ==========================================

/**
 * Toggles category chips and filters the events grid
 */
window.toggleChip = function(el) {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('on'));
    el.classList.add('on');

    const category = el.textContent.toLowerCase().replace('✦ ', '');
    activeFilter = category;
    
    filterEventGrid(category);
};

/**
 * Logic to show/hide event cards based on selected filter
 */
function filterEventGrid(filter) {
    const cards = document.querySelectorAll('.ev-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.ev-card-title').textContent.toLowerCase();
        const meta = card.querySelector('.ev-card-meta').textContent.toLowerCase();
        
        // Simple keyword matching for the prototype
        const isMatch = filter === 'all events' || 
                        title.includes(filter) || 
                        meta.includes(filter);

        card.style.display = isMatch ? 'flex' : 'none';
        if (isMatch) visibleCount++;
    });

    // Update sub-header text
    const subHeader = document.querySelector('.section-sub');
    if (subHeader) {
        subHeader.textContent = `${visibleCount} events found for "${filter}"`;
    }
}

// ==========================================
// 4. REGISTRATION LOGIC
// ==========================================

/**
 * Toggles the registration state of an event card
 */
window.toggleReg = function(btn) {
    const isRegistered = btn.classList.contains('registered');
    const cardTitle = btn.closest('.ev-card-body').querySelector('.ev-card-title').textContent;

    if (isRegistered) {
        btn.classList.remove('registered');
        btn.textContent = 'Register';
        if (window.toast) window.toast(`Unregistered from ${cardTitle.substring(0, 20)}...`);
    } else {
        btn.classList.add('registered');
        btn.textContent = '✓ Registered';
        if (window.toast) window.toast(`Successfully registered for ${cardTitle.substring(0, 20)}! 🎟`);
    }
};

// ==========================================
// 5. EVENT CREATION WIZARD
// ==========================================

window.setType = function(el, type) {
    document.querySelectorAll('.type-opt').forEach(o => o.classList.remove('on'));
    el.classList.add('on');
    updatePreview();
};

/**
 * Synchronizes form inputs with the live preview card
 */
window.updatePreview = function() {
    const titleInput = document.getElementById('evTitle');
    const dateInput = document.getElementById('evDate');
    const timeInput = document.getElementById('evTime');
    
    const prevTitle = document.getElementById('prevTitle');
    const prevDate = document.getElementById('prevDate');

    if (prevTitle) {
        prevTitle.textContent = titleInput.value || 'Your event title';
    }

    if (dateInput && prevDate) {
        const dateVal = dateInput.value;
        const timeVal = timeInput.value;

        if (dateVal) {
            try {
                const d = new Date(`${dateVal}T${timeVal || '00:00'}`);
                const dateStr = d.toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
                const timeStr = timeVal ? ` · ⏰ ${d.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}` : '';
                
                prevDate.textContent = `🗓 ${dateStr}${timeStr}`;
            } catch (e) {
                prevDate.textContent = '🗓 Invalid date selected';
            }
        } else {
            prevDate.textContent = '🗓 Select a date and time';
        }
    }
};

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial date in the form to today for convenience
    const dateField = document.getElementById('evDate');
    if (dateField) {
        const today = new Date().toISOString().split('T')[0];
        dateField.setAttribute('min', today);
    }

    console.log("Events module initialized. Happy hosting! 📅");
});
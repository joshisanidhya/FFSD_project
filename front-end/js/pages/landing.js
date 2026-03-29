/**
 * NexusHub — Landing & Authentication Logic
 * Handles demo login, session initialization, and entry animations.
 */

// ==========================================
// 1. DEPENDENCIES & CHECK
// ==========================================
// Note: loginUser and getCurrentUser are expected to be available 
// via your auth.js module or globally if not using ESM.

document.addEventListener('DOMContentLoaded', () => {
    // Session Check: Redirect if already authenticated
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user) {
        window.location.href = 'dashboard.html';
        return;
    }

    initLanding();
});

// ==========================================
// 2. INITIALIZATION
// ==========================================

function initLanding() {
    setupLoginForm();
    setupDemoPersonas();
    animateLanding();
    
    console.log("NexusHub Landing initialized. Ready for auth.");
}

// ==========================================
// 3. AUTHENTICATION LOGIC
// ==========================================

function setupLoginForm() {
    const loginForm = document.getElementById('demo-login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('login-username');
        const roleSelect = document.getElementById('login-role');
        const loginBtn = document.getElementById('login-btn');

        const username = usernameInput.value.trim();
        const role = roleSelect.value;

        if (username && role) {
            // UI Feedback: Loading state
            if (loginBtn) {
                loginBtn.innerHTML = `<span class="spinner"></span> Logging in...`;
                loginBtn.disabled = true;
            }

            // Save session (Local Storage logic usually lives in auth.js)
            if (typeof loginUser === 'function') {
                loginUser(username, role);
            }

            // Simulate network latency for polished feel
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);

        } else {
            // Error Handling
            highlightError([usernameInput, roleSelect]);
            if (window.toast) {
                window.toast("⚠️ Please provide a name and select a role.");
            } else {
                alert("Please enter a username and select a role.");
            }
        }
    });
}

/**
 * Quick-start personas for evaluators/testers
 */
function setupDemoPersonas() {
    const adminPill = document.getElementById('demo-admin');
    const memberPill = document.getElementById('demo-member');

    if (adminPill) {
        adminPill.addEventListener('click', () => {
            fillAndSubmit("Super Admin", "admin");
        });
    }

    if (memberPill) {
        memberPill.addEventListener('click', () => {
            fillAndSubmit("Alex Morgan", "member");
        });
    }
}

function fillAndSubmit(name, role) {
    const uInput = document.getElementById('login-username');
    const rSelect = document.getElementById('login-role');
    const form = document.getElementById('demo-login-form');

    if (uInput) uInput.value = name;
    if (rSelect) rSelect.value = role;
    
    // Trigger the submit event
    if (form) form.dispatchEvent(new Event('submit'));
}

// ==========================================
// 4. ANIMATION ENGINE
// ==========================================

function animateLanding() {
    const hero = document.querySelector('.hero-content');
    const loginCard = document.querySelector('.login-card');

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        hero.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 200);
    }

    if (loginCard) {
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'scale(0.95)';
        loginCard.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'scale(1)';
        }, 500);
    }
}

// ==========================================
// 5. HELPER UTILITIES
// ==========================================

function highlightError(elements) {
    elements.forEach(el => {
        if (el && !el.value) {
            el.style.borderColor = 'var(--error, #f87171)';
            el.classList.add('shake-animation');
            setTimeout(() => {
                el.style.borderColor = '';
                el.classList.remove('shake-animation');
            }, 2000);
        }
    });
}

/**
 * Toggles password visibility if a toggle icon exists
 */
window.togglePassword = function(btn) {
    const input = btn.previousElementSibling;
    if (input && input.type === 'password') {
        input.type = 'text';
        btn.textContent = '👁️';
    } else if (input) {
        input.type = 'password';
        btn.textContent = '🙈';
    }
};
/**
 * NexusHub — Authentication & RBAC Logic
 * Handles session persistence via localStorage and Role-Based Access Control (RBAC).
 */

// ==========================================
// 1. SESSION MANAGEMENT
// ==========================================

/**
 * Initializes a user session
 * @param {string} username 
 * @param {string} role - 'admin', 'mod', or 'member'
 */
export function loginUser(username, role) {
    const user = { 
        username, 
        role, 
        loginTime: new Date().toISOString(),
        token: `mock_token_${Math.random().toString(36).substr(2)}` // For future API use
    };
    
    localStorage.setItem('nexus_user', JSON.stringify(user));
    
    console.log(`%c[AUTH] %cLogged in as: ${username} (${role})`, "color: #10B981; font-weight: bold;", "color: #fff;");
    return user;
}

/**
 * Retrieves the currently logged-in user object
 * @returns {Object|null}
 */
export function getCurrentUser() {
    const session = localStorage.getItem('nexus_user');
    if (!session) return null;
    
    try {
        return JSON.parse(session);
    } catch (e) {
        console.error("Malformed session data. Clearing storage.");
        localStorage.removeItem('nexus_user');
        return null;
    }
}

/**
 * Clears the session and redirects to the landing page
 */
export function logoutUser() {
    localStorage.removeItem('nexus_user');
    
    // Smooth transition
    if (window.toast) window.toast("Logging out...");
    
    setTimeout(() => {
        window.location.href = 'index.html'; // Or landing.html based on your structure
    }, 500);
}

// ==========================================
// 2. ROUTE PROTECTION (RBAC)
// ==========================================

/**
 * Acts as a Gatekeeper for protected pages.
 * Use this at the top of your page-specific JS files.
 * @param {Array} allowedRoles - e.g., ['admin', 'mod']
 * @returns {boolean}
 */
export function requireRole(allowedRoles) {
    const user = getCurrentUser();

    // 1. No user found
    if (!user) {
        console.warn("[AUTH] Unauthenticated access attempt.");
        window.location.href = 'index.html?error=unauthorized';
        return false;
    }

    // 2. Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.error(`[AUTH] Access Denied. User role: ${user.role}. Required: ${allowedRoles}`);
        
        // Redirect back to home with a specific flag
        window.location.href = 'dashboard.html?error=forbidden';
        return false;
    }

    return true;
}

/**
 * Non-blocking check for UI elements (e.g., showing/hiding buttons)
 */
export function hasPermission(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// ==========================================
// 3. AUTO-INITIALIZATION
// ==========================================

// This runs on every page that imports this module
(function initAuth() {
    // Check for error flags in URL to show toasts
    const params = new URLSearchParams(window.location.search);
    if (params.has('error') && window.toast) {
        const err = params.get('error');
        if (err === 'forbidden') window.toast("🚫 You don't have permission to access that.");
        if (err === 'unauthorized') window.toast("🔒 Please log in to continue.");
    }
})();
/**
 * Inventory System - Modern JavaScript Module
 * Handles core functionality, utilities, and UI interactions
 */

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce function for optimizing event handlers
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info'
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--spacing-md);">
            <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.animation = 'slideIn 0.3s ease-out';
    });

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Render activity timeline on dashboard
 */
function renderActivities() {
    const container = document.querySelector('.card-body .timeline-item')
        ? document.querySelector('.card-body')
        : null;
    // if no container, try id
    const timelineWrapper = document.querySelector('#activityTimeline');
    if (!timelineWrapper) return;

    timelineWrapper.innerHTML = activities.map((act, index) => {
        return `
        <div class="timeline-item">
            <div class="timeline-dot">${index + 1}</div>
            <div class="timeline-content">
                <div class="timeline-title">${act.description}</div>
                <div class="timeline-date">${formatDate(act.date)}</div>
            </div>
        </div>`;
    }).join('');
}

/**
 * Update metric cards on dashboard based on stored items
 */
function updateDashboardMetrics() {
    const items = getFromStorage('items', []);
    const totalEl = document.querySelector('.metric-total .metric-card-value');
    const lowEl = document.querySelector('.metric-low-qty .metric-card-value');
    const emptyEl = document.querySelector('.metric-empty-stock .metric-card-value');

    const total = items.length;
    const low = items.filter(i => Number(i.qty) > 0 && Number(i.qty) <= 5).length;
    const empty = items.filter(i => Number(i.qty) === 0).length;

    if (totalEl) totalEl.textContent = total;
    if (lowEl) lowEl.textContent = low;
    if (emptyEl) emptyEl.textContent = empty;
}

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} True if visible
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== DOM MANIPULATION ====================

/**
 * Add flash animation to element
 * @param {Element} element - Element to animate
 */
function flashElement(element) {
    element.classList.add('flash-new');
    setTimeout(() => element.classList.remove('flash-new'), 600);
}

/**
 * Clear form inputs
 * @param {Element} form - Form element
 */
function clearForm(form) {
    if (form) form.reset();
}

/**
 * Disable/Enable button
 * @param {Element} button - Button element
 * @param {boolean} disabled - Disabled state
 */
function setButtonState(button, disabled) {
    if (button) {
        button.disabled = disabled;
        button.style.opacity = disabled ? '0.5' : '1';
        button.style.cursor = disabled ? 'not-allowed' : 'pointer';
    }
}

// ==================== LOCAL STORAGE HELPERS ====================

// ---------- activity log support ----------
let activities = [];

// ---------- sample data seeding ----------
function seedSampleData() {
    // items
    let items = getFromStorage('items', []);
    if (items.length === 0) {
        // assume categories[0] = Electronics, categories[1] = Office Supplies
        // units[0]=pcs, units[1]=box, units[2]=kg
        items = [
            { id: 1, name: 'Widget', categoryId: 1, unitId: 1, qty: 10 },
            { id: 2, name: 'Gadget', categoryId: 1, unitId: 2, qty: 3 },
            { id: 3, name: 'Doohickey', categoryId: 2, unitId: 3, qty: 0 },
            { id: 4, name: 'Thingamajig', categoryId: 1, unitId: 1, qty: 25 },
            { id: 5, name: 'Contraption', categoryId: 2, unitId: 2, qty: 1 }
        ];
        saveToStorage('items', items);
        // create activity entries for seeded items
        items.forEach(i => {
            addActivity('item-added', `Added ${i.name}`);
            if (Number(i.qty) === 0) {
                addActivity('item-out-of-stock', `Item \"${i.name}\" is out of stock`);
            } else if (Number(i.qty) <= 5) {
                addActivity('item-low-stock', `Item \"${i.name}\" low quantity (${i.qty})`);
            }
        });
    }

    // categories
    let categories = getFromStorage('categories', []);
    if (categories.length === 0) {
        categories = [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Office Supplies' }
        ];
        saveToStorage('categories', categories);
    }

    // units
    let units = getFromStorage('units', []);
    if (units.length === 0) {
        units = [
            { id: 1, name: 'pcs' },
            { id: 2, name: 'box' },
            { id: 3, name: 'kg' }
        ];
        saveToStorage('units', units);
    }

    // activities: ensure at least some history
    loadActivities();
    if (activities.length === 0) {
        addActivity('item-added', 'Added Widget');
        addActivity('item-added', 'Added Gadget');
        addActivity('item-added', 'Added Doohickey');
        addActivity('category-added', 'Added Electronics category');
        addActivity('unit-added', 'Added pcs unit');
    }
}

/**
 * Add an activity entry
 * @param {string} type - e.g. 'item-added', 'item-deleted'
 * @param {string} description - human readable description
 */
function addActivity(type, description) {
    const entry = {
        id: Date.now(),
        type,
        description,
        date: new Date().toISOString()
    };
    activities.unshift(entry);
    // keep only latest 50 activities
    if (activities.length > 50) activities.length = 50;
    saveActivities();
    // if dashboard visible, re-render
    if (window.location.pathname.endsWith('dashboard.html')) {
        renderActivities();
        updateDashboardMetrics();
    }
}

function loadActivities() {
    activities = getFromStorage('activities', []);
}

function saveActivities() {
    saveToStorage('activities', activities);
}


// ==================== UTILITY FUNCTIONS ====================

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default if not found
 * @returns {any} Stored or default value
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Storage error:', e);
        return defaultValue;
    }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Storage error:', e);
        showToast('Failed to save data', 'error');
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Storage error:', e);
    }
}

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function(e) {
    // Alt+L to logout
    if (e.altKey && e.key === 'l') {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) logoutBtn.click();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const instance = bootstrap.Modal.getInstance(modal);
            if (instance) instance.hide();
        });
    }
});

// ==================== PAGE LOAD HANDLER ====================

document.addEventListener('DOMContentLoaded', function() {
    // initial storage loads
    loadActivities();
    seedSampleData();
    // Initialize sidebar active states
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initialize user profile if element exists
    const username = getFromStorage('username') || 'User';
    const profileAvatarEls = document.querySelectorAll('#profileAvatar');
    const profileNameEls = document.querySelectorAll('#profileName');

    profileAvatarEls.forEach(el => {
        el.textContent = getInitials(username);
    });

    profileNameEls.forEach(el => {
        el.textContent = username;
    });

    // Redirect to login if not authenticated
    const isLoginPage = currentPage === 'login.html';
    const isAuthenticated = !!getFromStorage('username');

    if (!isLoginPage && !isAuthenticated) {
        // Only redirect if we're not on login page and have actual protected pages
        const protectedPages = ['dashboard.html', 'items.html', 'categories.html', 'units.html', 'index.html'];
        if (protectedPages.includes(currentPage)) {
            // Uncomment to enforce login
            // window.location.href = 'login.html';
        }
    }

    // render dashboard data if present
    if (currentPage === 'dashboard.html') {
        updateDashboardMetrics();
        renderActivities();
    }

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// ==================== EXPORT FOR MODULE SYSTEMS ====================

// For future use with module bundlers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        showToast,
        formatDate,
        getInitials,
        isInViewport,
        flashElement,
        clearForm,
        setButtonState,
        getFromStorage,
        saveToStorage,
        removeFromStorage
    };
}

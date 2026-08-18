// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    checkActiveSession();
});

// Reveal background and elements on interaction
function revealContent() {
    document.body.classList.add('revealed');
}

// Open Auth Modal (Login or Sign Up)
function openModal(formType, event) {
    if (event) {
        event.stopPropagation();
    }
    document.getElementById('authModal').classList.add('active');
    switchForm(formType);
}

// Close Auth Modal
function closeModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Toggle between Login and Sign Up forms
function switchForm(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Database Storage Helpers
function getUsersDB() {
    return JSON.parse(localStorage.getItem('ev_users_db')) || [];
}

function saveUserToDB(user) {
    let users = getUsersDB();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    // If account exists, update it; otherwise add new account
    if (existingIndex !== -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    localStorage.setItem('ev_users_db', JSON.stringify(users));
}

// Handle Login & Sign Up Actions
function handleAuth(event, type) {
    event.preventDefault();

    if (type === 'register') {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.toLowerCase().trim();
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;

        const newUser = { name, email, password, role };
        saveUserToDB(newUser);

        // 2. First-time signup directly logs in and goes to webpage
        setActiveSession(newUser);
        closeModal();

    } else if (type === 'login') {
        const email = document.getElementById('loginEmail').value.toLowerCase().trim();
        const password = document.getElementById('loginPassword').value;

        const users = getUsersDB();
        
        // 3. Check email and password against stored sign up details
        const validUser = users.find(u => u.email === email && u.password === password);

        if (validUser) {
            setActiveSession(validUser);
            closeModal();
        } else {
            alert('Invalid email or password. Please check your credentials and try again.');
        }
    }
}

// Set active session
function setActiveSession(user) {
    localStorage.setItem('ev_active_user', JSON.stringify(user));
    checkActiveSession();
    navigateToDashboard();
}

// Sign Out
function logout() {
    localStorage.removeItem('ev_active_user');
    checkActiveSession();
    navigateToLanding();
}

// Navigation Functions
function navigateToLanding() {
    document.getElementById('landingView').classList.remove('hidden-view');
    document.getElementById('dashboardView').classList.add('hidden-view');
}

function navigateToDashboard() {
    document.getElementById('landingView').classList.add('hidden-view');
    document.getElementById('dashboardView').classList.remove('hidden-view');
}

// Session and Navigation State Management
function checkActiveSession() {
    const activeUser = JSON.parse(localStorage.getItem('ev_active_user'));
    
    const navAuthArea = document.getElementById('navAuthArea');
    const adminCard = document.getElementById('adminCard');
    const driverCard = document.getElementById('driverCard');

    if (activeUser) {
        revealContent();

        // 1. Navbar displays Home, Profile Info, Dashboard, and Sign Out when logged in
        navAuthArea.innerHTML = `
            <button class="nav-btn back-btn" onclick="navigateToLanding()"><i class="fa-solid fa-house"></i> Home</button>
            <button class="nav-btn back-btn" onclick="navigateToDashboard()"><i class="fa-solid fa-gauge"></i> Dashboard</button>
            <span class="user-tag"><i class="fa-solid fa-circle-user"></i> ${activeUser.email} (${activeUser.name})</span>
            <button class="nav-btn login-btn" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
        `;

        document.getElementById('userDisplayName').textContent = activeUser.name;
        document.getElementById('userRoleBadge').textContent = activeUser.role;

        if (activeUser.role === 'admin') {
            adminCard.classList.remove('hidden-view');
            driverCard.classList.remove('hidden-view');
            switchPortalView('admin');
        } else {
            adminCard.classList.add('hidden-view');
            driverCard.classList.remove('hidden-view');
            switchPortalView('driver');
        }

    } else {
        // Reset header to default guest state
        navAuthArea.innerHTML = `
            <button class="nav-btn login-btn" onclick="openModal('login', event)">Login</button>
            <button class="nav-btn signup-btn" onclick="openModal('register', event)">Sign Up</button>
        `;
    }
}

// Switch view metrics inside the dashboard portal
function switchPortalView(portalType) {
    const portalContainer = document.getElementById('portalContent');
    const portalTitle = document.getElementById('portalTitle');
    const metricsGrid = document.getElementById('metricsGrid');

    portalContainer.classList.remove('hidden-view');

    if (portalType === 'admin') {
        portalTitle.innerHTML = `<i class="fa-solid fa-user-shield"></i> Admin Fleet Control Panel`;
        metricsGrid.innerHTML = `
            <div class="metric-card">
                <i class="fa-solid fa-car"></i>
                <h4>Total Active Fleet</h4>
                <p>128 Vehicles</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-heart-pulse"></i>
                <h4>Avg Fleet Battery Health</h4>
                <p>94.2%</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-charging-station"></i>
                <h4>Charging Hub Status</h4>
                <p>18 Active</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h4>System Alerts</h4>
                <p>0 Critical</p>
            </div>
        `;
    } else if (portalType === 'driver') {
        portalTitle.innerHTML = `<i class="fa-solid fa-car-battery"></i> Driver Live Telemetry`;
        metricsGrid.innerHTML = `
            <div class="metric-card">
                <i class="fa-solid fa-battery-three-quarters"></i>
                <h4>Battery Remaining</h4>
                <p>82%</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-route"></i>
                <h4>Estimated Range</h4>
                <p>310 km</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-gauge-high"></i>
                <h4>Avg Consumption</h4>
                <p>15.4 kWh/100km</p>
            </div>
            <div class="metric-card">
                <i class="fa-solid fa-location-dot"></i>
                <h4>Nearest Station</h4>
                <p>2.4 km away</p>
            </div>
        `;
    }
}
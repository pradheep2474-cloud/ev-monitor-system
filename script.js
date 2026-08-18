// Reveal all hidden elements on touch/click
function revealContent() {
    document.body.classList.add('revealed');
}

// Open Modal with targeted form
function openModal(formType, event) {
    if (event) {
        event.stopPropagation(); // Prevents background click trigger collision
    }
    document.getElementById('authModal').classList.add('active');
    switchForm(formType);
}

// Close Modal
function closeModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Switch between Login and Sign Up forms inside modal
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

// Close modal when clicking outside of card
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Handle Form Submission
function handleAuth(event, type) {
    event.preventDefault();
    alert(`${type} successful! Accessing EV Cars Monitor Dashboard...`);
    closeModal();
}
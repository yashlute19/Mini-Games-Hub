class AuthManager {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.loadTheme();
    }

    initializeElements() {
        // Tab buttons
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');

        // Password visibility toggles
        this.passwordToggles = document.querySelectorAll('.toggle-password');

        // Form inputs
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.signupName = document.getElementById('signupName');
        this.signupEmail = document.getElementById('signupEmail');
        this.signupPassword = document.getElementById('signupPassword');
        this.confirmPassword = document.getElementById('confirmPassword');
    }

    initializeEventListeners() {
        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Password visibility toggle
        this.passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });

        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));

        // Social login buttons
        document.querySelector('.social-btn.google').addEventListener('click', () => this.handleSocialLogin('google'));
        document.querySelector('.social-btn.facebook').addEventListener('click', () => this.handleSocialLogin('facebook'));
    }

    switchTab(clickedButton) {
        // Update active tab
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        // Show corresponding form
        const formToShow = clickedButton.dataset.tab === 'login' ? this.loginForm : this.signupForm;
        const formToHide = clickedButton.dataset.tab === 'login' ? this.signupForm : this.loginForm;

        formToHide.classList.remove('active');
        formToShow.classList.add('active');
    }

    togglePasswordVisibility(event) {
        const toggle = event.target;
        const input = toggle.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        
        input.type = type;
        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = this.loginEmail.value;
        const password = this.loginPassword.value;
        const rememberMe = document.getElementById('rememberMe').checked;

        try {
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful login
            const user = await this.mockLoginAPI(email, password);
            
            if (user) {
                // Store user data if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(user));
                }
                
                // Redirect to home page
                window.location.href = 'index.html';
            }
        } catch (error) {
            this.showError('Invalid email or password');
        }
    }

    async handleSignup(event) {
        event.preventDefault();
        
        const name = this.signupName.value;
        const email = this.signupEmail.value;
        const password = this.signupPassword.value;
        const confirmPassword = this.confirmPassword.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate passwords match
        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        // Validate terms agreement
        if (!agreeTerms) {
            this.showError('Please agree to the Terms & Conditions');
            return;
        }

        try {
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful signup
            const user = await this.mockSignupAPI(name, email, password);
            
            if (user) {
                // Store user data
                localStorage.setItem('user', JSON.stringify(user));
                
                // Redirect to home page
                window.location.href = 'index.html';
            }
        } catch (error) {
            this.showError('Error creating account');
        }
    }

    handleSocialLogin(provider) {
        // Here you would implement social login logic
        console.log(`Logging in with ${provider}`);
        // For now, just show a message
        this.showError(`${provider} login is not implemented yet`);
    }

    // Mock API calls (replace with real API calls in production)
    async mockLoginAPI(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation
        if (email === 'test@example.com' && password === 'password') {
            return {
                id: 1,
                name: 'Test User',
                email: email
            };
        }
        throw new Error('Invalid credentials');
    }

    async mockSignupAPI(name, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful signup
        return {
            id: Date.now(),
            name: name,
            email: email
        };
    }

    showError(message) {
        // Create error element if it doesn't exist
        let errorElement = document.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            document.querySelector('.auth-box').insertBefore(
                errorElement,
                document.querySelector('.auth-form.active')
            );
        }

        // Show error message
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Hide error after 3 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// Initialize the auth manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();
}); 
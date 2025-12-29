// login.js - Care Connect+ Login System

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const roleOptions = document.querySelectorAll('.role-option');
    const userRoleInput = document.getElementById('userRole');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const demoCredentials = document.getElementById('demoCredentials');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Demo credentials (will be replaced with PHP authentication)
    const validCredentials = {
        doctor: {
            username: 'doctor',
            password: 'doctor123',
            redirect: 'doctor-dashboard.html' // Will be: doctor.php
        },
        admin: {
            username: 'admin',
            password: 'admin123',
            redirect: 'admin-dashboard.html' // Will be: admin.php
        }
    };

    // Check for remembered credentials
    checkRememberedCredentials();

    // Role selection
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            roleOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update hidden input
            const role = this.dataset.role;
            userRoleInput.value = role;
            
            // Update demo credentials display
            updateDemoCredentials(role);
        });
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error message
        hideErrorMessage();
        
        // Get form values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const role = userRoleInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Validate inputs
        if (!username || !password) {
            showErrorMessage('Please enter both username and password.');
            return;
        }
        
        // Save credentials if "Remember me" is checked
        if (rememberMe) {
            saveCredentials(username, role);
        } else {
            clearSavedCredentials();
        }
        
        // PHP SPOT 1: This is where AJAX call to PHP will go
        // authenticateUser(username, password, role);
        
        // For demo purposes - check against hardcoded credentials
        // This will be replaced with PHP authentication
        
        // Check if credentials match demo data
        const roleCreds = validCredentials[role];
        if (roleCreds && username === roleCreds.username && password === roleCreds.password) {
            // PHP SPOT 2: Successful login - redirect to dashboard
            // In PHP, you would set session variables here
            
            console.log(`Login successful as ${role}`);
            console.log(`Redirecting to: ${roleCreds.redirect}`);
            
            // Simulate API call delay
            showLoadingState();
            
            setTimeout(() => {
                // PHP SPOT 3: Redirect to appropriate dashboard
                // window.location.href = roleCreds.redirect;
                
                // For demo, show success message
                showSuccessMessage();
            }, 1000);
            
        } else {
            // PHP SPOT 4: Failed login - show error
            showErrorMessage('Invalid username or password. Please try again.');
            
            // Add error animation
            loginForm.classList.add('error-shake');
            setTimeout(() => loginForm.classList.remove('error-shake'), 500);
        }
    });

    // Input validation on blur
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);

    // Helper Functions
    function validateUsername() {
        const username = usernameInput.value.trim();
        if (!username) {
            showInputError(usernameInput, 'Username is required');
            return false;
        }
        clearInputError(usernameInput);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value.trim();
        if (!password) {
            showInputError(passwordInput, 'Password is required');
            return false;
        }
        if (password.length < 6) {
            showInputError(passwordInput, 'Password must be at least 6 characters');
            return false;
        }
        clearInputError(passwordInput);
        return true;
    }

    function showInputError(input, message) {
        input.style.borderColor = '#e74c3c';
        input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        // Create or update error tooltip
        let errorTooltip = input.parentNode.querySelector('.error-tooltip');
        if (!errorTooltip) {
            errorTooltip = document.createElement('div');
            errorTooltip.className = 'error-tooltip';
            input.parentNode.appendChild(errorTooltip);
        }
        errorTooltip.textContent = message;
        errorTooltip.style.display = 'block';
    }

    function clearInputError(input) {
        input.style.borderColor = '#e1e5ee';
        input.style.boxShadow = 'none';
        
        const errorTooltip = input.parentNode.querySelector('.error-tooltip');
        if (errorTooltip) {
            errorTooltip.style.display = 'none';
        }
    }

    function showErrorMessage(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
        errorMessage.style.animation = 'shake 0.5s ease';
    }

    function hideErrorMessage() {
        errorMessage.style.display = 'none';
    }

    function showSuccessMessage() {
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Login successful! Redirecting to dashboard...</span>
        `;
        
        // Style success message
        successMsg.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            background: #e8f6ef;
            border: 1px solid #2ecc71;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            color: #27ae60;
            animation: slideIn 0.5s ease;
        `;
        
        // Insert before form
        loginForm.parentNode.insertBefore(successMsg, loginForm);
        
        // Redirect after delay (in PHP, this would be immediate)
        setTimeout(() => {
            // PHP SPOT 5: Actual redirect
            // For demo, we'll just reload to show the message
            window.location.reload();
        }, 2000);
    }

    function showLoadingState() {
        const submitBtn = loginForm.querySelector('.login-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
        submitBtn.disabled = true;
        
        // Reset after 2 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function updateDemoCredentials(role) {
        const creds = validCredentials[role];
        if (creds) {
            demoCredentials.innerHTML = `
                <h4><i class="fas fa-vial"></i> Demo Credentials (${role})</h4>
                <p><strong>Username:</strong> ${creds.username}</p>
                <p><strong>Password:</strong> ${creds.password}</p>
            `;
        }
    }

    // PHP SPOT 6: Local storage for "Remember me" feature
    // In PHP, you would use cookies or sessions instead
    
    function saveCredentials(username, role) {
        const credentials = {
            username: username,
            role: role,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('careConnect_remembered', JSON.stringify(credentials));
    }

    function clearSavedCredentials() {
        localStorage.removeItem('careConnect_remembered');
    }

    function checkRememberedCredentials() {
        const saved = localStorage.getItem('careConnect_remembered');
        if (saved) {
            try {
                const credentials = JSON.parse(saved);
                
                // Check if saved within last 30 days
                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                if (new Date().getTime() - credentials.timestamp < thirtyDays) {
                    usernameInput.value = credentials.username;
                    
                    // Activate corresponding role
                    roleOptions.forEach(option => {
                        if (option.dataset.role === credentials.role) {
                            option.click();
                        }
                    });
                    
                    rememberMeCheckbox.checked = true;
                    passwordInput.focus();
                } else {
                    clearSavedCredentials();
                }
            } catch (e) {
                clearSavedCredentials();
            }
        }
    }

    // PHP AJAX Authentication Function (Template)
    function authenticateUser(username, password, role) {
        /*
        // This is how the PHP AJAX call will look:
        fetch('api/authenticate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                role: role
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // PHP will set session and return redirect URL
                window.location.href = data.redirect;
            } else {
                showErrorMessage(data.message || 'Authentication failed');
            }
        })
        .catch(error => {
            console.error('Authentication error:', error);
            showErrorMessage('Server error. Please try again later.');
        });
        */
    }

    // Initialize
    updateDemoCredentials('doctor');
    
    // Add CSS for error tooltips
    const style = document.createElement('style');
    style.textContent = `
        .error-tooltip {
            display: none;
            position: absolute;
            background: #e74c3c;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8rem;
            margin-top: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        .error-tooltip:before {
            content: '';
            position: absolute;
            top: -5px;
            left: 10px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #e74c3c;
        }
        .error-shake {
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});
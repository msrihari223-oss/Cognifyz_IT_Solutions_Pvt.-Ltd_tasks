document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Dynamic DOM Updates ---
    const greetingElement = document.getElementById('dynamic-greeting');
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting = 'Good Evening,';
        if (hour < 12) greeting = 'Good Morning,';
        else if (hour < 18) greeting = 'Good Afternoon,';
        greetingElement.textContent = greeting;
    }

    // --- 2. Client-Side Routing ---
    const handleRoute = () => {
        let hash = window.location.hash || '#home';

        // Hide all sections, show active one
        document.querySelectorAll('.page-section').forEach(section => {
            if (`#${section.id}` === hash) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update nav links active state
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Listen to hash changes and initial load
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call once on load

    // --- 3. Form Validation & Password Strength ---
    const passwordInput = document.getElementById('password');
    const strengthMeterContainer = document.getElementById('strengthMeterContainer');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const submitBtn = document.getElementById('submitBtn');

    // Rules
    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNumber = document.getElementById('rule-number');
    const ruleSpecial = document.getElementById('rule-special');

    const registrationForm = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const val = this.value;

            // Show meter if there's typing
            if (val.length > 0) {
                strengthMeterContainer.classList.remove('d-none');
            } else {
                strengthMeterContainer.classList.add('d-none');
                updateSubmitButton(0);
                return;
            }

            let score = 0;

            // Check Length
            if (val.length >= 8) {
                score++;
                ruleLength.classList.replace('text-danger', 'text-success');
            } else {
                ruleLength.classList.replace('text-success', 'text-danger');
            }

            // Check Uppercase
            if (/[A-Z]/.test(val)) {
                score++;
                ruleUpper.classList.replace('text-danger', 'text-success');
            } else {
                ruleUpper.classList.replace('text-success', 'text-danger');
            }

            // Check Number
            if (/[0-9]/.test(val)) {
                score++;
                ruleNumber.classList.replace('text-danger', 'text-success');
            } else {
                ruleNumber.classList.replace('text-success', 'text-danger');
            }

            // Check Special Char
            if (/[^A-Za-z0-9]/.test(val)) {
                score++;
                ruleSpecial.classList.replace('text-danger', 'text-success');
            } else {
                ruleSpecial.classList.replace('text-success', 'text-danger');
            }

            // Update Bar and Text
            strengthBar.style.width = (score * 25) + '%';

            strengthBar.classList.remove('bg-danger', 'bg-warning', 'bg-info', 'bg-success');
            if (score === 1) {
                strengthText.textContent = 'Weak';
                strengthBar.classList.add('bg-danger');
            } else if (score === 2) {
                strengthText.textContent = 'Fair';
                strengthBar.classList.add('bg-warning');
            } else if (score === 3) {
                strengthText.textContent = 'Good';
                strengthBar.classList.add('bg-info');
            } else if (score === 4) {
                strengthText.textContent = 'Strong';
                strengthBar.classList.add('bg-success');
            } else {
                strengthText.textContent = 'Too Short';
                strengthBar.classList.add('bg-danger');
                strengthBar.style.width = '10%'; // Just to show a little bit
            }

            updateSubmitButton(score);
        });

        // Basic check for other fields to enable submit
        const updateSubmitButton = (score) => {
            const isUsernameValid = usernameInput.value.trim().length > 0;
            const isEmailValid = emailInput.value.includes('@');
            const isPasswordValid = score === 4;

            if (isUsernameValid && isEmailValid && isPasswordValid) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        };

        // Listen to other inputs to enable submit if password is ready
        usernameInput.addEventListener('input', () => updateSubmitButton(document.querySelectorAll('.text-success').length));
        emailInput.addEventListener('input', () => updateSubmitButton(document.querySelectorAll('.text-success').length));

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration Successful!');
            registrationForm.reset();
            strengthMeterContainer.classList.add('d-none');
            submitBtn.disabled = true;
            // Reset rules
            [ruleLength, ruleUpper, ruleNumber, ruleSpecial].forEach(el => {
                el.classList.replace('text-success', 'text-danger');
            });
            window.location.hash = '#home';
        });
    }
});

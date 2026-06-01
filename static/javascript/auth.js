function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    const errorMsg = document.getElementById('errorMsg');

    btn.textContent = 'Signing in...';
    btn.disabled = true;
    errorAlert.style.display = 'none';

    fetch('/userverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Invalid Credentials');
        }
    })
    .then(data => {
        if (data) {

            window.location.href = "/dashboard";
        }
    })
    .catch(err => {
        console.error(err);
        errorMsg.textContent = 'Invalid email or password. Please try again.';
        errorAlert.style.display = 'flex';
        btn.textContent = 'Sign In';
        btn.disabled = false;
    });
}

// SIGNUP

function handleSignup(e) {
    e.preventDefault();
    
    const fName = document.getElementById('firstName').value.trim();
    const lName = document.getElementById('lastName').value.trim();
    const name = fName + " " + lName;
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value.trim();

    const btn = document.getElementById('signupBtn');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    const errorMsg = document.getElementById('errorMsg');

    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';

    if (password !== confirm) {
        errorMsg.textContent = 'Passwords do not match. Please try again.';
        errorAlert.style.display = 'flex';
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters long.';
        errorAlert.style.display = 'flex';
        return;
    }

    btn.textContent = 'Creating account...';
    btn.disabled = true;

    const userdata = { name, email, password, role };

    fetch('/useradded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userdata)
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else if (res.status === 409) {
            throw new Error('Email already registered!');
        } else {
            throw new Error('Something went wrong. Please try again.');
        }
    })
    .then(data => {
        successAlert.style.display = 'flex';
        setTimeout(() => {
            window.location.href = "/login";
        }, 1500);
    })
    .catch(err => {
        console.error(err);
        errorMsg.textContent = err.message;
        errorAlert.style.display = 'flex';
        btn.textContent = 'Create Account';
        btn.disabled = false;
    });
}
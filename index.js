async function signup() {
    document.getElementById('sign-up-form').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
    
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
    
        const data = { username, email, password };
    
        try {
            const response = await fetch('https://novicaapi.azurewebsites.net/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const result = await response.json();
                alert('User created successfully!');
                // Redirect to login
                window.location.href = 'login.html';
            } else {
                const error = await response.text();
                alert('User already exists, try logging in');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    });
}

document.addEventListener("DOMContentLoaded", signup);

async function login(){
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        const data = { email, password };
    
        try {
            const response = await fetch('https://novicaapi.azurewebsites.net/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.ok) {
                const result = await response.text(); // Assume success message or use JSON if needed
                alert('Login successful!');
                
                // Save email and username in session storage
                sessionStorage.setItem('email', email);
                console.log('email: ' + email);
    
                window.location.href = 'dashboard.html'; // Redirect to dashboard

                

            } else {
                const error = await response.text();
                alert(`Error: ${error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    });
}

document.addEventListener("DOMContentLoaded", login);

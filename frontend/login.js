const loginUser = async () => {
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('http://localhost:5001/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log('Response:', result);

        if (response.ok) {
            alert('Login successful');
            localStorage.setItem('token', result.token); 

            if (result.user && result.user.role === 'admin') {
                window.location.href = 'http://127.0.0.1:5500/frontend/admin.html'; 
            } else if (result.user && result.user.role === 'user') {
                window.location.href = 'http://127.0.0.1:5500/frontend/tracks_user.html'; 
            } else {
                console.error('Unknown user role:', result);
                document.getElementById('loginMessage').textContent = 'Error: Unknown user role.';
            }
        } else {
            document.getElementById('loginMessage').textContent = 'Error: ' + result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    loginUser();
});
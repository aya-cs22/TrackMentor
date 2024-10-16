const registerUser = async () => {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('http://localhost:5001/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Registration successful, please verify your email');
            window.location.href = 'verify-email.html';
        } else {
            document.getElementById('registerMessage').textContent = 'Error: ' + result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Add an event when the form is submitted
document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the page from being reloaded
    registerUser(); // Call the registration function
});
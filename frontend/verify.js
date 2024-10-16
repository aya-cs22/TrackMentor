const verifyEmail = async () => {
    const formData = {
        email: document.getElementById('email').value,
        code: document.getElementById('verificationCode').value,
    };

    try {
        const response = await fetch('http://localhost:5001/api/users/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Email verified successfully!');
            window.location.href = 'login.html';
        } else {
            document.getElementById('verifyMessage').textContent = 'Error: ' + result.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


// Add an event when the form is submitted
document.getElementById('verifyForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the page from being reloaded
    verifyEmail(); // Call the verifion function
});

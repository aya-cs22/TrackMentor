// Function to display the username in the admin dashboard
const displayUsername = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found, user not logged in.');
        return;
    }

    try {
        // Fetch user data to get the username
        const response = await fetch('http://localhost:5001/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            // Display the user's name in the dashboard
            // Check if userData has a name property
            if (userData && userData.name) {
                document.getElementById('username').textContent = userData.name; // Display actual username
            } else {
                document.getElementById('username').textContent = 'User Name'; // Fallback if name is not available
                console.error('User name not found in user data.');
            }
        } else {
            console.error('Error fetching user data:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Call the function to display the username when the page loads
displayUsername();
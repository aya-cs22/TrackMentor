const apiUrl = 'http://localhost:5001/api/users';
let currentUserId = null; 

// Function to fetch and display users
async function fetchUsers() {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });

    if (response.status === 401) {
        alert('Unauthorized! Please log in.');
        return; 
    }

    const users = await response.json();
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <h3>${user.name} (${user.role})</h3>
            <p>Email: ${user.email}</p>
            <button onclick="editUser('${user._id}', '${user.name}', '${user.email}', '${user.role}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
        `;
        usersList.appendChild(userDiv);
    });
}

// Function to add a new user
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('addName').value;
    const email = document.getElementById('addEmail').value;
    const password = document.getElementById('addPassword').value;
    const role = document.getElementById('addRole').value;

    const userData = {
        name,
        email,
        password,
        role
    };

    const token = localStorage.getItem('token'); 

    await fetch(`${apiUrl}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(userData),
    });

    fetchUsers();
    document.getElementById('addUserForm').reset();
});

// Function to edit a user
function editUser(id, name, email, role) {
    currentUserId = id; 
    document.getElementById('editName').value = name; 
    document.getElementById('editEmail').value = email; 
    document.getElementById('editRole').value = role; 
}

// Function to save changes to the user
document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;

    const userData = {
        name,
        email,
        role
    };

    const token = localStorage.getItem('token'); 

    await fetch(`${apiUrl}/${currentUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(userData),
    });

    currentUserId = null; 
    fetchUsers();
    document.getElementById('editUserForm').reset();
});

// Function to delete a user
async function deleteUser(id) {
    const token = localStorage.getItem('token'); 

    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });

    fetchUsers();
}

// Initial fetch to display users
fetchUsers();
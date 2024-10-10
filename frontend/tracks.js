document.addEventListener('DOMContentLoaded', () => {
    fetchTracks();

    document.getElementById('trackForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const trackId = document.getElementById('trackId').value;
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;

        if (trackId) {
            updateTrack(trackId, { name, description });
        } else {
            addTrack({ name, description });
        }
    });
});

function fetchTracks() {
    fetch('http://localhost:5001/api/tracks', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        const tracksList = document.getElementById('tracksList');
        tracksList.innerHTML = '';
        data.forEach(track => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <span>${track.name}</span>
                <button onclick="editTrack('${track._id}', '${track.name}', '${track.description}')">Edit</button>
                <button onclick="deleteTrack('${track._id}')">Delete</button>
            `;
            tracksList.appendChild(trackItem);
        });
    })
    .catch(error => console.error('Error fetching tracks:', error));
}

function addTrack(track) {
    fetch('http://localhost:5001/api/tracks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') 
        },
        body: JSON.stringify(track)
    })
    .then(response => {
        console.log('Response:', response);
        return response.json();
    })
    .then(data => {
        console.log('Track added:', data);
        fetchTracks(); 
        document.getElementById('trackForm').reset(); 
    })
    .catch(error => console.error('Error adding track:', error));
}


function editTrack(id, name, description) {
    document.getElementById('trackId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('description').value = description;
}

function deleteTrack(id) {
    fetch(`http://localhost:5001/api/tracks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Track deleted:', data);
        fetchTracks(); 
    })
    .catch(error => console.error('Error deleting track:', error));
}

function updateTrack(id, track) {
    fetch(`http://localhost:5001/api/tracks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') 
        },
        body: JSON.stringify(track)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Track updated:', data);
        fetchTracks(); 
        document.getElementById('trackForm').reset();
    })
    .catch(error => console.error('Error updating track:', error));
}

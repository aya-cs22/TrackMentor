const loadTracks = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:5001/api/tracks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const tracks = await response.json();
            const tracksList = document.getElementById('tracksList');
            tracksList.innerHTML = ''; // Clear previous content

            tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item'; // Add a class for styling

                const trackName = document.createElement('h3');
                trackName.textContent = track.name;

                const trackDescription = document.createElement('p');
                trackDescription.textContent = track.description || "No description available";

                const trackButton = document.createElement('button');
                trackButton.textContent = "View Languages";
                trackButton.addEventListener('click', () => {
                    window.location.href = `languages.html?trackId=${track._id}`; 
                });

                trackItem.appendChild(trackName);
                trackItem.appendChild(trackDescription);
                trackItem.appendChild(trackButton);

                tracksList.appendChild(trackItem);
            });
        } else {
            console.error('Error fetching tracks:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const filterTracks = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const trackItems = document.querySelectorAll('.track-item');

    trackItems.forEach(item => {
        const trackName = item.querySelector('h3').textContent.toLowerCase();
        if (trackName.includes(searchInput)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

window.onload = loadTracks;
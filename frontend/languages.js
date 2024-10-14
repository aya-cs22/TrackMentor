const loadLanguages = async () => {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('trackId'); 

    if (!trackId) {
        console.error('Track ID not found in URL');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/languages/track/${trackId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const languages = await response.json();
            console.log('Languages response:', languages);

            const languagesList = document.getElementById('languagesList');
            languagesList.innerHTML = ''; 

            if (languages.length === 0) {
                languagesList.textContent = 'No languages found for this track.';
            } else {
                languages.forEach(language => {
                    const languageItem = document.createElement('div');
                    languageItem.className = 'language-item';

                    // Create a link for the language
                    const languageLink = document.createElement('a');
                    languageLink.href = `lessons.html?languageId=${language._id}`;
                    languageLink.textContent = language.name;
                    languageLink.className = 'language-link'; 

                    languageItem.appendChild(languageLink);
                    languagesList.appendChild(languageItem);
                });
            }
        } else {
            console.error('Error fetching languages:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

window.onload = loadLanguages;

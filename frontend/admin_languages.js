const apiUrl = 'http://localhost:5001/api/languages';

// Function to add a new language
document.getElementById('addLanguageForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const languageData = {
        name: document.getElementById('languageName').value,
        description: document.getElementById('languageDescription').value,
        trackId: document.getElementById('trackId').value,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(languageData)
        });

        const result = await response.json();
        alert(result.message || 'Language added successfully!');
        loadLanguages(); 
        document.getElementById('languageName').value = '';
        document.getElementById('languageDescription').value = '';
        document.getElementById('trackId').value = '';
    } catch (error) {
        console.error('Error adding language:', error);
        alert('Failed to add language. Please try again.'); 
    }
});

// Function to load all languages
async function loadLanguages() {
    try {
        const response = await fetch(apiUrl);
        const languages = await response.json();
        const languagesList = document.getElementById('languagesList');
        languagesList.innerHTML = '';

        languages.forEach(language => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${language.name} - ${language.description} 
                <button onclick="fetchLanguage('${language._id}')">Edit</button>
                <button onclick="deleteLanguage('${language._id}')">Delete</button>`;
            languagesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading languages:', error);
        alert('Failed to load languages. Please try again.'); 
    }
}

// Function to fetch a specific language for editing
async function fetchLanguage(languageId) {
    try {
        const response = await fetch(`${apiUrl}/${languageId}`);
        const language = await response.json();
        if (language) {
            document.getElementById('editLanguageId').value = language._id; 
            document.getElementById('editLanguageName').value = language.name;
            document.getElementById('editLanguageDescription').value = language.description;
            document.getElementById('editTrackId').value = language.trackId;
            document.getElementById('languageDetails').style.display = 'block';
        } else {
            alert('Language not found');
        }
    } catch (error) {
        console.error('Error fetching language:', error);
        alert('Failed to fetch language. Please try again.');
    }
}

// Function to update a language
async function updateLanguage(event) {
    event.preventDefault();
    const languageId = document.getElementById('editLanguageId').value;
    const languageData = {
        name: document.getElementById('editLanguageName').value,
        description: document.getElementById('editLanguageDescription').value,
        trackId: document.getElementById('editTrackId').value,
    };

    try {
        const response = await fetch(`${apiUrl}/${languageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(languageData)
        });

        const result = await response.json();
        alert(result.message || 'Language updated successfully!');
        loadLanguages(); 
        document.getElementById('languageDetails').style.display = 'none'; 
    } catch (error) {
        console.error('Error updating language:', error);
        alert('Failed to update language. Please try again.'); 
    }
}

// Function to delete a language
async function deleteLanguage(languageId) {
    if (confirm('Are you sure you want to delete this language?')) {
        try {
            const response = await fetch(`${apiUrl}/${languageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            const result = await response.json();
            alert(result.message || 'Language deleted successfully!');
            loadLanguages();
        } catch (error) {
            console.error('Error deleting language:', error);
            alert('Failed to delete language. Please try again.');
        }
    }
}

// Initial load of languages
loadLanguages();

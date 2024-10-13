const lessonsApiUrl = 'http://localhost:5001/api/lessons';
const quill = new Quill('#editor', {
    theme: 'snow'
});
const editQuill = new Quill('#editEditor', {
    theme: 'snow'
});

// Function to add a new lesson
document.getElementById('addLessonForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const lessonData = {
        title: document.getElementById('lessonTitle').value,
        content: quill.root.innerHTML, 
        languageId: document.getElementById('lessonLanguageId').value
    };

    try {
        const response = await fetch(lessonsApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Use token from localStorage
            },
            body: JSON.stringify(lessonData)
        });

        const result = await response.json();
        alert(result.message || 'Lesson added successfully!');
        
        document.getElementById('lessonTitle').value = '';
        quill.setContents([]); 
        document.getElementById('lessonLanguageId').value = '';

        loadLessons();
    } catch (error) {
        console.error('Error adding lesson:', error);
        alert('Failed to add lesson. Please try again.');
    }
});

// Function to fetch all lessons
async function loadLessons() {
    try {
        const response = await fetch(lessonsApiUrl);
        const lessons = await response.json();
        const lessonsList = document.getElementById('lessonsList');
        lessonsList.innerHTML = '';

        lessons.forEach(lesson => {
            const listItem = document.createElement('li');
            listItem.textContent = `${lesson.title} - ${lesson.content}`;
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => fetchLesson(lesson._id);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => {
                if (confirm(`Are you sure you want to delete ${lesson.title}?`)) {
                    deleteLesson(lesson._id);
                }
            };

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            lessonsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading lessons:', error);
        alert('Failed to load lessons. Please try again.');
    }
}

// Function to fetch a specific lesson for editing
async function fetchLesson(lessonId) {
    try {
        const response = await fetch(`${lessonsApiUrl}/${lessonId}`);
        const lesson = await response.json();
        if (lesson) {
            document.getElementById('editLessonId').value = lesson._id;
            document.getElementById('editLessonTitle').value = lesson.title;
            editQuill.root.innerHTML = lesson.content; 
            document.getElementById('editLessonLanguageId').value = lesson.languageId;
            document.getElementById('lessonDetails').style.display = 'block'; 
        } else {
            alert('Lesson not found');
        }
    } catch (error) {
        console.error('Error fetching lesson:', error);
        alert('Failed to fetch lesson. Please try again.');
    }
}

// Function to update a lesson
async function updateLesson(event) {
    event.preventDefault();
    const lessonId = document.getElementById('editLessonId').value;
    const lessonData = {
        title: document.getElementById('editLessonTitle').value,
        content: editQuill.root.innerHTML,
        languageId: document.getElementById('editLessonLanguageId').value
    };

    try {
        const response = await fetch(`${lessonsApiUrl}/${lessonId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(lessonData)
        });

        const result = await response.json();
        alert(result.message || 'Lesson updated successfully!');
        loadLessons();
        document.getElementById('lessonDetails').style.display = 'none';
    } catch (error) {
        console.error('Error updating lesson:', error);
        alert('Failed to update lesson. Please try again.');
    }
}

// Function to delete a lesson
async function deleteLesson(lessonId) {
    try {
        const response = await fetch(`${lessonsApiUrl}/${lessonId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        const result = await response.json();
        alert(result.message || 'Lesson deleted successfully!');
        loadLessons();
    } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Failed to delete lesson. Please try again.');
    }
}

// Initial load of lessons
loadLessons();

const loadLessons = async () => {
    const params = new URLSearchParams(window.location.search);
    const languageId = params.get('languageId');
    if (!languageId) {
        console.error('Language ID not found in URL');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/lessons/language/${languageId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const lessons = await response.json();
            console.log('Lessons response:', lessons);

            const lessonsList = document.getElementById('lessonsList');
            lessonsList.innerHTML = '';
            if (lessons.length === 0) {
                lessonsList.textContent = 'No lessons found for this language.';
            } else {
                lessons.forEach(lesson => {
                    const lessonItem = document.createElement('div');
                    lessonItem.className = 'lesson-item';
                    const lessonLink = document.createElement('a');
                    lessonLink.href = `lesson_details.html?lessonId=${lesson._id}`;
                    lessonLink.textContent = lesson.title; 
                    lessonLink.className = 'lesson-link';
                    lessonItem.appendChild(lessonLink);
                    lessonsList.appendChild(lessonItem);
                });
            }
        } else {
            console.error('Error fetching lessons:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

window.onload = loadLessons;

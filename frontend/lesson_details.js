const loadLessonDetails = async () => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');

    if (!lessonId) {
        console.error('Lesson ID not found in URL');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/lessons/${lessonId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const lesson = await response.json();
            console.log('Lesson response:', lesson);

            const lessonTitle = document.getElementById('lessonTitle');
            const lessonContent = document.getElementById('lessonContent');

            lessonTitle.textContent = lesson.title;
            lessonContent.innerHTML = lesson.content;
        } else {
            console.error('Error fetching lesson details:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const goBack = () => {
    window.history.back();
};

const goToQuiz = () => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId');
    if (lessonId) {
        window.location.href = `quiz.html?lessonId=${lessonId}`;
    }
};

window.onload = loadLessonDetails;

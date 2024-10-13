const apiUrl = 'http://localhost:5001/api/quizzes';
let currentQuizId = null; 
// Function to fetch and display quizzes
async function fetchQuizzes() {
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

    const quizzes = await response.json();
    const quizzesList = document.getElementById('quizzesList');
    quizzesList.innerHTML = '';

    quizzes.forEach(quiz => {
        const quizDiv = document.createElement('div');
        quizDiv.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <button onclick="editQuiz('${quiz._id}', '${quiz.title}', '${quiz.description}', '${quiz.lessonId}')">Edit</button>
            <button onclick="deleteQuiz('${quiz._id}')">Delete</button>
        `;
        quizzesList.appendChild(quizDiv);
    });
}

// Function to add or update a quiz
document.getElementById('quizForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const lessonId = document.getElementById('lessonId').value;
    const questions = getQuestions(); 

    const quizData = {
        title,
        description,
        question: questions,
        lessonId
    };

    const token = localStorage.getItem('token'); 

    if (currentQuizId) {
        await fetch(`${apiUrl}/${currentQuizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(quizData),
        });
        currentQuizId = null; 
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(quizData),
        });
    }

    fetchQuizzes();
    document.getElementById('quizForm').reset();
});

// Function to edit a quiz
function editQuiz(id, title, description, lessonId) {
    currentQuizId = id; 
    document.getElementById('title').value = title; 
    document.getElementById('description').value = description; 
    document.getElementById('lessonId').value = lessonId; 
}

// Function to delete a quiz
async function deleteQuiz(id) {
    const token = localStorage.getItem('token'); 
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}` 
        }
    });

    fetchQuizzes();
}

// Function to get questions from the form
function getQuestions() {
    const questionElements = document.querySelectorAll('.question');
    const questions = [];
    questionElements.forEach(element => {
        const questionText = element.querySelector('.questionText').value;
        const options = Array.from(element.querySelectorAll('.option')).map(opt => opt.value);
        const correctAnswer = element.querySelector('.correctAnswer').value;

        questions.push({ questionText, options, correctAnswer });
    });
    return questions;
}

// Function to add a new question input
function addQuestion() {
    const questionsDiv = document.getElementById('questions');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `
        <input type="text" class="questionText" placeholder="Question Text" required>
        <input type="text" class="option" placeholder="Option 1" required>
        <input type="text" class="option" placeholder="Option 2" required>
        <input type="text" class="option" placeholder="Option 3" required>
        <input type="text" class="correctAnswer" placeholder="Correct Answer" required>
        <button type="button" onclick="removeQuestion(this)">Remove Question</button>
    `;
    questionsDiv.appendChild(questionDiv);
}

// Function to remove a question input
function removeQuestion(button) {
    const questionDiv = button.parentElement;
    questionDiv.remove();
}

// Initial fetch to display quizzes
fetchQuizzes();
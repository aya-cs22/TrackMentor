let userAnswers = []; 
let quizzes = [];

const loadQuizzes = async () => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lessonId'); 

    try {
        const response = await fetch(`http://localhost:5001/api/quizzes/lessons/${lessonId}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        quizzes = await response.json(); 
        const questionsList = document.getElementById('questions-list');
        
        quizzes.forEach(quiz => {
            quiz.question.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.innerHTML = `
                    <p>${index + 1}. ${question.questionText}</p>
                    ${question.options.map(option => `
                        <label>
                            <input type="radio" name="question${index}" value="${option}" onchange="saveAnswer(${index}, '${option}')">
                            ${option}
                        </label>
                    `).join('')}
                `;
                questionsList.appendChild(questionDiv);
            });
        });
    } catch (error) {
        console.error('Error loading quizzes:', error);
    }
};

const saveAnswer = (questionIndex, answer) => {
    userAnswers[questionIndex] = answer;
};

const checkAnswers = () => {
    let correctCount = 0; 

    quizzes.forEach(quiz => {
        quiz.question.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correctAnswer;

            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        });
    });

    const params = new URLSearchParams({
        correctCount,
        totalQuestions: quizzes[0].question.length,
        languageId: new URLSearchParams(window.location.search).get('languageId'),
        userAnswers: JSON.stringify(userAnswers),
        quizzes: JSON.stringify(quizzes)
    });

    window.location.href = `reviewPage.html?${params.toString()}`;
};

document.getElementById('submitQuiz').onclick = checkAnswers;
window.onload = loadQuizzes;
const reviewContent = document.getElementById('review-content');
const backToLessonsButton = document.getElementById('backToLessons');
const params = new URLSearchParams(window.location.search);
const correctCount = params.get('correctCount');
const totalQuestions = params.get('totalQuestions');
const userAnswers = JSON.parse(params.get('userAnswers'));
const quizzes = JSON.parse(params.get('quizzes'));

const showReviewPage = () => {
    const reviewPage = document.createElement('div');
    reviewPage.innerHTML = `<h2>Quiz Review</h2>`;

    if (parseInt(correctCount) === parseInt(totalQuestions)) {
        reviewPage.innerHTML += `
            <p>Congratulations! You answered all the questions correctly! 🎉</p>
            <p>You're ready for the next lesson.</p>
        `;
    } else {
        reviewPage.innerHTML += `<p>You answered ${correctCount} out of ${totalQuestions} questions correctly.</p>`;
        reviewPage.innerHTML += `<p>Here are the correct answers:</p>`;
        
        const answersList = document.createElement('ul');
        
        quizzes[0].question.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correctAnswer;

            let result = userAnswer === correctAnswer ? '✔️' : `❌ (Correct answer: ${correctAnswer})`;

            answersList.innerHTML += `
                <li>${index + 1}. ${question.questionText} <strong>${result}</strong></li>
            `;
        });

        reviewPage.appendChild(answersList);
    }

    reviewContent.appendChild(reviewPage);
};

backToLessonsButton.onclick = () => {
    window.location.href = "http://127.0.0.1:5500/frontend/tracks_user.html";
};

window.onload = showReviewPage;

const quizData = {
    questions: []
};

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("time-left");
const playAgainButton = document.getElementById("play-again");

// Function to clean fetched JSON string
function removeJsonWrapper(input) {
    return input.replace(/```json|```/g, "").trim();
}

async function fetchQuestions() {
    try {
        const response = await fetch('https://testifidemo2.onrender.com/generate_questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: "Generation and Conduction of Nerve Impulse" })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch questions.');
        }

        const data = await response.json(); // Parse the initial JSON response
        console.log("Raw Fetched Data:", data);

        // Clean the `questions` string if it has Markdown wrappers
        const cleanedJson = removeJsonWrapper(data.questions);
        console.log("Cleaned JSON:", cleanedJson);

        // Parse the cleaned JSON string from the `questions` field
        const nestedQuestions = JSON.parse(cleanedJson); // Convert the string into an object
        console.log("Nested Questions:", nestedQuestions);

        // Validate the nested structure
        if (!Array.isArray(nestedQuestions.questions)) {
            throw new Error("Invalid format: 'questions' is not an array.");
        }

        // Assign to quizData.questions
        quizData.questions = nestedQuestions.questions;

        // Start the quiz
        startQuiz();
    } catch (error) {
        console.error("Error fetching questions:", error);
        questionElement.textContent = "Error loading questions. Please try again later.";
        optionsElement.innerHTML = `<p>${error.message}</p>`;
        playAgainButton.classList.remove("hidden");
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    playAgainButton.classList.add("hidden");

    if (quizData.questions.length === 0) {
        questionElement.textContent = "No questions available.";
        return;
    }

    displayQuestion();
}

function displayQuestion() {
    if (timer) clearInterval(timer);
    timeLeft = 20;
    timerElement.textContent = timeLeft;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    Object.keys(currentQuestion.options).forEach(key => {
        const button = document.createElement("button");
        button.textContent = `${key}: ${currentQuestion.options[key]}`;
        button.addEventListener("click", () => checkAnswer(key));
        optionsElement.appendChild(button);
    });

    startTimer();
}

function checkAnswer(selectedOption) {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const buttons = optionsElement.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent.startsWith(currentQuestion.answer)) {
            button.classList.add("correct");
            if (selectedOption === currentQuestion.answer) {
                score++;
            }
        } else if (button.textContent.startsWith(selectedOption)) {
            button.classList.add("wrong");
        }
    });

    clearInterval(timer);
    goToNextQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = timeLeft;
        } else {
            clearInterval(timer);
            goToNextQuestion();
        }
    }, 1000);
}

function goToNextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1) {
        currentQuestionIndex++;
        setTimeout(displayQuestion, 1000);
    } else {
        setTimeout(endQuiz, 1000);
    }
}

function endQuiz() {
    clearInterval(timer);
    const totalQuestions = quizData.questions.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    questionElement.textContent = `Quiz Over!`;
    optionsElement.innerHTML = `
        <p>Your Score: ${score} / ${totalQuestions}</p>
        <p>Percentage: ${percentage}%</p>
    `;
    playAgainButton.classList.remove("hidden");
}

playAgainButton.addEventListener("click", fetchQuestions);

// Fetch questions and start the quiz
fetchQuestions();

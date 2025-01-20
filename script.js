
const quizData =
{
  "questions": [
    {
      "question": "What does the term \"antibiotic\" literally mean?",
      "options": {
        "A": "Against life",
        "B": "Pro life",
        "C": "Supporting life",
        "D": "Neutral to life"
      },
      "answer": "A"
    },
    {
      "question": "Which of these was the first antibiotic to be discovered?",
      "options": {
        "A": "Streptomycin",
        "B": "Penicillin",
        "C": "Tetracycline",
        "D": "Erythromycin"
      },
      "answer": "B"
    },
    {
      "question": "Who discovered Penicillin?",
      "options": {
        "A": "Louis Pasteur",
        "B": "Alexander Fleming",
        "C": "Robert Koch",
        "D": "Edward Jenner"
      },
      "answer": "B"
    },
    {
      "question": "Penicillin was discovered while working on which bacteria?",
      "options": {
        "A": "E. coli",
        "B": "Staphylococci",
        "C": "Streptococci",
        "D": "Salmonella"
      },
      "answer": "B"
    },
    {
      "question": "Antibiotics are produced by which of the following?",
      "options": {
        "A": "Some microbes",
        "B": "All microbes",
        "C": "Plants only",
        "D": "Animals only"
      },
      "answer": "A"
    },
    {
      "question": "Antibiotics can be used to treat which of the following diseases?",
      "options": {
        "A": "Plague",
        "B": "Whooping cough",
        "C": "Diphtheria",
        "D": "All of the above"
      },
      "answer": "D"
    },
    {
      "question": "What is the function of antibiotics with reference to disease-causing organisms?",
      "options": {
        "A": "Promote growth",
        "B": "Kill or retard growth",
        "C": "Have no effect",
        "D": "Enhance virulence"
      },
      "answer": "B"
    },
    {
      "question": "What is the chemical nature of antibiotics?",
      "options": {
        "A": "Proteins",
        "B": "Carbohydrates",
        "C": "Lipids",
        "D": "Chemical substances"
      },
      "answer": "D"
    },
    {
      "question": "What was the observation that led to the discovery of Penicillin?",
      "options": {
        "A": "A mould growing around which Staphylococci could not grow",
        "B": "Staphylococci growing rapidly in a culture plate",
        "C": "A clear zone in a bacterial colony",
        "D": "Growth of a different bacteria in the culture plate"
      },
      "answer": "A"
    },
    {
      "question": "Antibiotics are considered a significant discovery of which century?",
      "options": {
        "A": "19th century",
        "B": "20th century",
        "C": "18th century",
        "D": "21st century"
      },
      "answer": "B"
    }
  ]
}


let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("time-left");
const playAgainButton = document.getElementById("play-again");

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    playAgainButton.classList.add("hidden");
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

playAgainButton.addEventListener("click", startQuiz);

// Initialize the quiz
startQuiz();

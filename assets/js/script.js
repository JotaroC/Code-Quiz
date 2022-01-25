let startButton = document.querySelector("#start");
let submitButton = document.querySelector("#submit");
let viewButton = document.querySelector("#view-score");
let clearButton = document.querySelector("#clear");
let backButton = document.querySelector("#back");

let timeEl = document.querySelector(".timer");
let timerEl = document.querySelector("#time");
let score_ContainerEl = document.querySelector("#score-container");
let quiz_ContainerEl = document.querySelector("#quiz-container");
let quiz_QuestionsEl = document.querySelector("#quiz-questions");
let question_TitleEl = document.querySelector("#question-title");
let question_choiceEl = document.querySelector("#choices");
let end_ScreenEl = document.querySelector("#end-screen");
let final_ScoreEl = document.querySelector("#final-score");
let feedbackEl = document.querySelector("#feedback");
let initialEl = document.querySelector("#initials");
let scoreListEl = document.querySelector("#score-list");

let timer;
let timeCount;
let question_Index = 0;
let currentQuestion = questions[question_Index];
let scoreBoard = [];

function init() {
  hide(score_ContainerEl);
  hide(end_ScreenEl);
  let score = JSON.parse(localStorage.getItem("scoreBoard"));

  if(score !== null) {
    scoreBoard = score;
  }
}

function startGame() {
    isEnd = false;
    timeCount = 150;
    startButton.disabled = true;

    hide(quiz_ContainerEl);
    hide(viewButton);

    startTimer();
    getQuestion();
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
    // Sets timer
    timer = setInterval(function() {
        timerEl.textContent = timeCount;
        timeCount--;
      // Tests if time has run out
      if (timeCount === 0) {
        // Clears interval
        clearInterval(timer);
        quizEnd();
      }
    }, 1000);
}

function getQuestion() {
    console.log(currentQuestion.title);
    question_TitleEl.textContent = currentQuestion.title;
    question_choiceEl.textContent = "";
    
    for(let i=0; i<currentQuestion.choices.length; i++) {
        let choiceButton = document.createElement("button");
        choiceButton.setAttribute("class", "choices");
        choiceButton.setAttribute("value", currentQuestion.choices[i]);

        choiceButton.textContent = (i+1) + ". " + currentQuestion.choices[i];
        question_choiceEl.appendChild(choiceButton);

        choiceButton.addEventListener("click",clickQuestion);
    }
}

function clickQuestion() {
    if (this.value != currentQuestion.answer) {
        // penalize time
        timeCount -= 10;

        if (timeCount <= 0) {
            timeCount = 0;
        }
        // display new time on page
        timerEl.textContent = timeCount;
        feedbackEl.textContent = "❌";
        feedbackEl.style.fontSize = "275%";
    } else {
        feedbackEl.textContent = "✔️";
        feedbackEl.style.fontSize = "275%";
    }

    // next question
    question_Index++;
    currentQuestion = questions[question_Index];
    // time checker
    if (question_Index == questions.length  || timeCount == 0) {
      quizEnd();
    } else {
      getQuestion();
    }
}    

function quizEnd() {
  clearInterval(timer);
  hide(quiz_QuestionsEl);
  show(end_ScreenEl);
  final_ScoreEl.textContent = timeCount;
}

function saveScore() {
  let initial = initialEl.value.trim();

  if(initial.length !== 0) {
    // format new score object for current user
    var newScore = {
      score: timeCount,
      initial: initial
    };

    // save to localstorage
    scoreBoard.push(newScore);
    localStorage.setItem("scoreBoard", JSON.stringify(scoreBoard));
    renderScore();
    hide(end_ScreenEl);
    show(score_ContainerEl);
  } else {
    alert("Please enter a vaild initial");
  }
}

function renderScore() {
  for (let i = 0; i < scoreBoard.length; i++) {
    let todo = scoreBoard[i];

    let li = document.createElement("li");
    li.textContent = todo.initial + " - " + todo.score;

    if(li.textContent != null) {
      scoreListEl.appendChild(li);
    }
  }
}

function show(element) {
  element.setAttribute("style","display: block");
}

function hide(element) {
  element.setAttribute("style","display: none");
}

function showScore() {
  hide(timeEl);
  hide(quiz_ContainerEl);
  renderScore();
  show(score_ContainerEl);
}

function clearHighscores() {
  localStorage.clear();
  location.reload();
}

function reload() {
  location.reload();
}

init();
startButton.addEventListener("click",startGame);
submitButton.addEventListener("click",saveScore);
viewButton.addEventListener("click",showScore);
clearButton.addEventListener("click",clearHighscores);
backButton.addEventListener("click",reload);

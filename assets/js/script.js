let startButton = document.querySelector("#start");
let submitButton = document.querySelector("#submit");
let clearButton = document.querySelector("#clear");
let timerEl = document.querySelector("#time");
let quiz_ContainerEl = document.querySelector("#quiz-container");
let quiz_QuestionsEl = document.querySelector("#quiz-questions");
let question_TitleEl = document.querySelector("#question-title");
let question_choiceEl = document.querySelector("#choices");
let end_ScreenEl = document.querySelector("#end-screen");
let feedbackEl = document.querySelector("#feedback");
let initialEl = document.querySelector("#initials");
let scoreListEl = document.querySelector("#score-list");



let timer;
let timeCount;
let isEnd = false;
let question_Index = 0;
let currentQuestion = questions[question_Index];
let scoreBoard = [];

function init() {
  let score = JSON.parse(localStorage.getItem("scoreBoard"));

  if(score !== null) {
    scoreBoard = score;
  }
  
}

function startGame() {
    isEnd = false;
    timeCount = 150;
    startButton.disabled = true;

    quiz_ContainerEl.setAttribute("style","display: none");
    end_ScreenEl.setAttribute("style","display: none");
    // quiz_ContainerEl.setAttribute("class","hide");
    // quiz_QuestionsEl.removeAttribute("class");
    
    startTimer();
    getQuestion();
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
    // Sets timer
    timer = setInterval(function() {
        timerEl.textContent = timeCount;
        timeCount--;
      if (timeCount >= 0) {
        // Tests if win condition is met
        if (isEnd && timeCount > 0) {
          // Clears interval and stops timer
          clearInterval(timer);
          quizEnd();
        }
      }
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
        feedbackEl.textContent = "Wrong!";
        feedbackEl.style.color = "red";
        feedbackEl.style.fontSize = "400%";
    } else {
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "green";
        feedbackEl.style.fontSize = "400%";
    }

    // flash right/wrong feedback
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
    }, 1000);

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

  quiz_QuestionsEl.setAttribute("style","display: none");
  end_ScreenEl.setAttribute("style","display: block");
  // document.getElementById("#final-score").textContent = score;
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
  } else {
    alert("Please enter a vaild initial");
  }
}

function renderScore() {
  for (let i = 0; i < scoreBoard.length; i++) {
    let todo = scoreBoard[i];

    let li = document.createElement("li");
    li.textContent = todo.initial + " - " + todo.score;
    // li.setAttribute("data-index", i);

    if(li.textContent != null) {
      scoreListEl.appendChild(li);
    }
  }
}

function clearHighscores() {
  localStorage.removeItem("highscores");
  location.reload();
}


init();
startButton.addEventListener("click",startGame);
submitButton.addEventListener("click",saveScore);
// clearButton.addEventListener("click",clearHighscores);

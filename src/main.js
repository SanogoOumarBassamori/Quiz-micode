import "./style.css";
import { Questions } from "./questions";

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");

// const colors = ["red","bleu", "green", "yellow"];

// let i = 0;

// setInterval(() => {

//   app.style.background = colors[i];
//   i++;
//   if (i > colors.length - 1) {
//     i=0;
//   }
// }, 1000);

// let j = 0;

// startButton.addEventListener("click", () => {
//   const question = document.querySelector("#question") ?? document.createElement("p");
//   question.id = "question";
//   question.innerText= Questions[j].question;
//   app.insertBefore(question, startButton);

//   j++;
//   if (j > Questions.length - 1) {
//     question.remove();
//     j = 0;
//   }
// });

startButton.addEventListener("click", startQuiz);

function startQuiz(event) {
  event.stopPropagation();
  let currentQuestion = 0;
  let score = 0;

  clean();
  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }



  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessage();
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);

    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();

    submitButton.addEventListener("click", submit);

    app.appendChild(submitButton);
  }

  function displayFinishMessage(){
    const h1 = document.createElement("h1");
    h1.innerText= "Bravo, vous avez terminé le quiz !";
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point`;

    app.appendChild(h1)
    app.appendChild(p)
  }

  function submit() {
    const selecteAnswer = app.querySelector('input[name="answer"]:checked');

    disableAllAnswers();
    const value = selecteAnswer.value;

    const question = Questions[currentQuestion];

    const isCorrect = question.correct === value;

    if (isCorrect) { 
      score++;
    }

    showFeedback(isCorrect, question.correct, value)
    
    displayNextQuestionButton(
      () => {
        currentQuestion++;
        displayQuestion(currentQuestion);
      }
    );
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);
    
    
  }
  

  function createAnswers(answers) {
    const answersDiv = document.createElement("div");

    answersDiv.classList.add("answers");

    for (const answer of answers) {
      const label = getAnswerElement(answer);

      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"',"'").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}


function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selecteAnswerId = formatId(answer);
  const selecteElement = document.querySelector(
    `label[for="${selecteAnswerId}"]`
  );

  correctElement.classList.add("correct");
  
  selecteElement.classList.add(isCorrect ? "correct" : "incorrect");

  
}

function getFeedbackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect ? "Bravo! Tu as eu la Bonne reponse" : `Désolé... mais la bonne réponse était ${correct}`;
  return paragraph;
}

function getProgressBar(max, value){
  const progress = document.createElement("progress");
  progress.setAttribute("max",max);
  progress.setAttribute("value",value);
  return progress;
}

function displayNextQuestionButton(callback){
  const TIMEOUT = 4000;
  let remaining = TIMEOUT;


  const getButtonText = () => `Next (${remaining/1000}s)`;

  app.querySelector("button").remove();

  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText();

  app.appendChild(nextButton);

  const interval = setInterval(() => {
    remaining -= 1000;
    nextButton.innerText = getButtonText();
  },1000);

  const timeout = setTimeout(() => {
    handleNextQuestion();
  }, TIMEOUT);

  const handleNextQuestion = () => {
    
    clearInterval(interval);
    clearTimeout(timeout);
    callback()
  }



  nextButton.addEventListener("click", () =>{
    handleNextQuestion()
  })
}

function disableAllAnswers(){
  const radioInputs = document.querySelectorAll('input[type="radio"]');

  for (const radio of radioInputs){
    radio.disabled = true;
  }
}
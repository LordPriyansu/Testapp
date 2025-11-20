let timerInterval;


function loadTest(questions){
const container = document.getElementById("testContainer");
questions.forEach((q, index) => {
const div = document.createElement("div");
div.className = "question";
div.innerHTML = `<b>Q${index+1}: ${q.question}</b><br>`;
q.options.forEach(opt => {
div.innerHTML += `<input type='radio' name='q${index}' value='${opt}'> ${opt}<br>`;
});
container.appendChild(div);
});
}


function submitTest(){
const q = window.questions;


let score = 0;
let details = [];


q.forEach((ques, i) => {
const selected = document.querySelector(`input[name="q${i}"]:checked`);
const selectedValue = selected ? selected.value : "None";
const correct = selectedValue === ques.answer;
if(correct) score++;


details.push({
question: ques.question,
selected: selectedValue,
answer: ques.answer,
correct: correct
});
});


localStorage.setItem("resultData", JSON.stringify({
score: score,
total: q.length,
details: details
}));


window.location.href = "result.html";
}


function startTimer(minutes){
let time = minutes * 60;
const timer = document.getElementById("timer");


timerInterval = setInterval(() => {
const mins = Math.floor(time / 60);
const secs = time % 60;
timer.innerHTML = `Time Left: ${mins}:${secs.toString().padStart(2, '0')}`;
if(time <= 0){
clearInterval(timerInterval);
alert("Time is up! Auto submitting.");
submitTest();
}
time--;
}, 1000);
}

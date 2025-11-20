// ========== CREATE TEST ==========
let arr = JSON.parse(localStorage.getItem(t));
arr.push({ q:q, opt:[o1,o2,o3,o4], ans:ans });
localStorage.setItem(t, JSON.stringify(arr));
alert("Question Added");
}


// ========== HOME PAGE TEST LIST ==========
function loadTestList(){
let div = document.getElementById("testList");
if(!div) return;
div.innerHTML = "";


for(let k in localStorage){
if(k !== "result") div.innerHTML += `<button onclick="openTest('${k}')">${k}</button><br>`;
}
}
function openTest(name){ localStorage.setItem("selectedTest", name); window.location="test.html"; }


// ========== LOAD TEST QUESTIONS ==========
function loadSelectedTest(){
let name = localStorage.getItem("selectedTest");
if(!name) return;
testTitle.innerHTML = name;
let data = JSON.parse(localStorage.getItem(name));
window.questions = data;


data.forEach((q,i)=>{
testContainer.innerHTML += `<div class='question'><b>Q${i+1}: ${q.q}</b><br>
${q.opt.map(o=>`<input type='radio' name='q${i}' value='${o}'> ${o}<br>`).join('')}</div>`;
});
}


// ========== SUBMIT TEST ==========
function submitTest(){
let score=0, details=[];


window.questions.forEach((q,i)=>{
let sel=document.querySelector(`input[name='q${i}']:checked`);
let val = sel?sel.value:"None";
if(val===q.ans) score++;
details.push({ q:q.q, selected:val, ans:q.ans, correct:(val===q.ans) });
});


localStorage.setItem("result", JSON.stringify({score:score, total:window.questions.length, details:details}));
window.location="result.html";
}


// ========== TIMER ==========
function startTimer(min){
let t = min*60;
let x = setInterval(()=>{
let m=Math.floor(t/60), s=t%60;
timer.innerHTML = `${m}:${s.toString().padStart(2,'0')}`;
if(t<=0){ clearInterval(x); submitTest(); }
t--;
},1000);
}

/* ===========================================
      SCRIPT.JS — FINAL CLEAN VERSION
=========================================== */

// ========== CREATE TEST ==========
function createTest(){
 let name = document.getElementById("testName").value.trim();
 let timer = document.getElementById("timerSelect").value;

 if(!name){
   alert("Enter test name");
   return;
 }

 // save empty question array
 localStorage.setItem(name, JSON.stringify([]));

 // save timer for test
 localStorage.setItem(name + "_timer", timer);

 alert("Test Created");
 loadAdminTestList();
}

// ========== LOAD TEST LISTS IN ADMIN ==========
function loadAdminTestList(){
 let addSelect = document.getElementById("testSelect");
 let delSelect = document.getElementById("deleteSelect");

 if(addSelect) addSelect.innerHTML = "";
 if(delSelect) delSelect.innerHTML = "";

 // FIX: Use localStorage.key(i) to avoid length/clear/getItem
 for(let i = 0; i < localStorage.length; i++){
   let k = localStorage.key(i);

   // skip result and timer entries
   if(k === "result") continue;
   if(k.endsWith("_timer")) continue;

   if(addSelect) addSelect.innerHTML += `<option>${k}</option>`;
   if(delSelect) delSelect.innerHTML += `<option>${k}</option>`;
 }
}

// ========== DELETE TEST ==========
function deleteTest(){
 let t = document.getElementById("deleteSelect").value;
 if(!t) return;

 if(confirm(`Delete test: ${t}?`)){
   localStorage.removeItem(t);         // remove questions
   localStorage.removeItem(t + "_timer"); // remove timer
   alert("Test Deleted");
   loadAdminTestList();
 }
}

// ========== ADD QUESTION ==========
function addQuestion(){
 let t = testSelect.value;
 let q = qText.value;
 let o1 = opt1.value, o2 = opt2.value, o3 = opt3.value, o4 = opt4.value;
 let ans = correct.value;

 if(!q||!o1||!o2||!o3||!o4||!ans){
   alert("Fill all fields");
   return;
 }

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

 for(let i = 0; i < localStorage.length; i++){
   let k = localStorage.key(i);

   if(k === "result" || k.endsWith("_timer")) continue;

   div.innerHTML += `<button onclick="openTest('${k}')">${k}</button><br>`;
 }
}

function openTest(name){
 localStorage.setItem("selectedTest", name);
 window.location = "test.html";
}

// ========== LOAD TEST QUESTIONS ==========
function loadSelectedTest(){
 let name = localStorage.getItem("selectedTest");
 if(!name) return;

 testTitle.innerHTML = name;

 let data = JSON.parse(localStorage.getItem(name));
 window.questions = data;

 // load timer
 window.testTimer = parseInt(localStorage.getItem(name + "_timer")) || 5;

 data.forEach((q,i)=>{
   testContainer.innerHTML += `
   <div class='question'>
     <b>Q${i+1}: ${q.q}</b><br>
     ${q.opt.map(o=>`<input type='radio' name='q${i}' value='${o}'> ${o}<br>`).join("")}
   </div>`;
 });
}

// ========== SUBMIT TEST ==========
function submitTest(){
 let score = 0, details = [];

 window.questions.forEach((q,i)=>{
   let sel = document.querySelector(`input[name='q${i}']:checked`);
   let val = sel ? sel.value : "None";

   if(val === q.ans) score += 1;
   else if(val !== "None") score -= 0.33;

   details.push({ 
     q: q.q, 
     selected: val, 
     ans: q.ans, 
     correct: (val === q.ans) 
   });
 });

 if(score < 0) score = 0;

 localStorage.setItem("result", JSON.stringify({
   score: score.toFixed(2),
   total: window.questions.length,
   details: details
 }));

 window.location = "result.html";
}
// ========== TIMER ==========
function startTimer(min){
 let t = min * 60;

 let x = setInterval(()=>{
   let m = Math.floor(t/60);
   let s = t % 60;

   timer.innerHTML = `${m}:${s.toString().padStart(2,'0')}`;

   if(t <= 0){
     clearInterval(x);
     submitTest();
   }

   t--;
 },1000);
}

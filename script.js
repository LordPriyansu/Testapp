/* BACKEND URL */
const API_URL = "https://script.google.com/macros/s/AKfycbwQtSLfNJ3IISpeeNEvOwXRCUecqotJICBR8UT-8FWnFeJ_RUQxzgM_7wmDtD3H2SM/exec";

/* CREATE TEST */
function createTest(){
 let name = testName.value.trim();
 if(!name){ alert("Enter test name"); return; }
 alert("Test Created (questions add karte hi backend save hoga)");
 loadAdminTestList();
}

/* ADD QUESTION TO GOOGLE SHEET */
function addQuestion(){
 let t = testSelect.value;
 let q = qText.value;
 let timer = timerSelect.value;

 let o1 = opt1.value;
 let o2 = opt2.value;
 let o3 = opt3.value;
 let o4 = opt4.value;
 let ans = correct.value;

 if(!q||!o1||!o2||!o3||!o4||!ans){
   alert("Fill all fields");
   return;
 }

 let url =
 `${API_URL}?action=addQuestion&test=${encodeURIComponent(t)}&timer=${timer}&q=${encodeURIComponent(q)}&o1=${encodeURIComponent(o1)}&o2=${encodeURIComponent(o2)}&o3=${encodeURIComponent(o3)}&o4=${encodeURIComponent(o4)}&ans=${encodeURIComponent(ans)}`;

 fetch(url)
   .then(r=>r.text())
   .then(()=>alert("Question Added ✔"))
   .catch(()=>alert("Error adding question"));
}

/* DELETE TEST */
function deleteTest(){
 let t = deleteSelect.value;
 if(!t) return;

 if(confirm(`Delete test: ${t}?`)){
   fetch(`${API_URL}?action=deleteTest&test=${encodeURIComponent(t)}`)
     .then(r=>r.text())
     .then(()=>{
       alert("Deleted ✔");
       loadAdminTestList();
     });
 }
}

/* LOAD TEST LIST */
function loadTestList(){
 let div = document.getElementById("testList");

 fetch(`${API_URL}?action=getTests`)
   .then(r=>r.json())
   .then(data=>{
     div.innerHTML = "";
     Object.keys(data).forEach(test=>{
       div.innerHTML += `<button onclick="openTest('${test}')">${test}</button><br>`;
     });
   });
}

function openTest(t){
 localStorage.setItem("selectedTest", t);
 window.location="test.html";
}

/* LOAD QUESTIONS FOR TEST */
function loadSelectedTest(){
 let name = localStorage.getItem("selectedTest");

 fetch(`${API_URL}?action=getTests`)
   .then(r=>r.json())
   .then(data=>{
     let test = data[name];
     window.questions = test.questions;
     window.testTimer = parseInt(test.timer);

     testTitle.innerHTML = name;

     test.questions.forEach((q,i)=>{
       testContainer.innerHTML += `
        <div class="question">
         <b>Q${i+1}:</b> ${q.q}<br>
         ${q.opt.map(o=>`<input type='radio' name='q${i}' value='${o}'> ${o}<br>`).join("")}
        </div>`;
     });

     startTimer(window.testTimer);
   });
}

/* SUBMIT TEST (NEGATIVE MARKING) */
function submitTest(){
 let score=0, details=[];

 questions.forEach((q,i)=>{
   let sel=document.querySelector(`input[name='q${i}']:checked`);
   let val = sel ? sel.value : "None";

   if(val === q.ans) score += 1;
   else if(val !== "None") score -= 0.33;

   details.push({
     q:q.q,
     selected:val,
     ans:q.ans,
     correct:(val===q.ans)
   });
 });

 if(score < 0) score = 0;

 localStorage.setItem("result", JSON.stringify({
   score: score.toFixed(2),
   total: questions.length,
   details: details
 }));

 window.location="result.html";
}

/* TIMER */
function startTimer(min){
 let t = min * 60;

 let x = setInterval(()=>{
   let m=Math.floor(t/60);
   let s=t%60;

   timer.innerHTML = `${m}:${s.toString().padStart(2,'0')}`;

   if(t <= 0){
     clearInterval(x);
     submitTest();
   }
   t--;
 },1000);
}

/* LOAD ADMIN TEST LIST */
function loadAdminTestList(){
 let addSel=document.getElementById("testSelect");
 let delSel=document.getElementById("deleteSelect");

 fetch(`${API_URL}?action=getTests`)
   .then(r=>r.json())
   .then(data=>{
     addSel.innerHTML="";
     delSel.innerHTML="";

     Object.keys(data).forEach(t=>{
       addSel.innerHTML += `<option>${t}</option>`;
       delSel.innerHTML += `<option>${t}</option>`;
     });
   });
}

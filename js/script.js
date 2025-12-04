// -------------------------------------
// QUESTIONS
// -------------------------------------
const questions = [
[
"A corner kick is taken by Team A. As the ball swings into the penalty area, an attacker is being lightly held by a defender, but the attacker breaks free and heads the ball over the bar. The holding had no clear impact on the header.",
"Penalty + Caution for defender (tactical foul)",
"Play on – trifling contact",
"Hold the defender accountable at next stoppage with a verbal warning",
"Penalty only (no card)",
"B"
],
[
"A through ball is played into the penalty area. The attacker and goalkeeper both sprint for it. The attacker gets a slight touch on the ball before colliding heavily with the keeper. The ball rolls out harmlessly for a goal kick. The collision appears careless, but not reckless.",
"Penalty – careless challenge by goalkeeper",
"Play on – normal football contact",
"Attacker foul – impeding/charging into goalkeeper",
"Drop ball to goalkeeper",
"C"
],
[
"A defender slides to block a low cross. His arm, which is slightly extended for balance, stops the ball from reaching an attacker in a promising position.The distance is short but the arm clearly increases his body surface area.",
"Penalty – handball",
"Play on – natural position",
"Penalty + yellow card for SPA",
"Penalty + red card for DOGSO",
"A"
],
[
"A shot is taken from outside the area. An attacker in an offside position stands very close to the goalkeeper, though he does not touch the ball. The ball goes into the net.Replays show the attacker clearly blocked the goalkeeper’s line of vision.",
"Goal",
"Offside – IFK to defence",
"Penalty for pushing by defender",
"Drop ball",
"B"
],
[
"A defender clears the ball inside the penalty area. After the clearance, an attacker comes in late and kicks the defender’s ankle, causing pain.",
"Foul on attacker – DFK coming out + caution",
"Penalty – defender initiated contact",
"Play on – ball was already gone",
"DFK + red card for SFP by attacker",
"A"
],
[
"An attacker is tripped but manages to stay on their feet and gets an immediate shot, which the goalkeeper parries. The rebound falls to a teammate who scores.",
"Award the goal – advantage realised",
"Bring play back for penalty",
"Goal + caution for defender",
"Goal + no card",
"A"
],
[
"A defender accidentally miskicks a clearance and the ball spins backwards. The goalkeeper dives and grabs it inside the penalty area.",
"IFK – deliberate back-pass",
"Play on – not deliberate",
"Penalty",
"IFK + caution",
"B"
],
[
"During a free kick into the penalty area, an attacker gives a subtle push on the defender’s back, gaining the space needed to score a header.",
"Goal",
"Attacking foul – DFK to defence",
"Penalty",
"Drop ball",
"B"
],
[
"During the run-up, the kicker feints to kick, stops, then kicks the ball into the net. The feint occurs at the end of the run-up.",
"Goal",
"Retake",
"IDFK to defence + caution",
"IDFK + no card",
"C"
],
[
"An attacker dribbles into the penalty area. A defender pulls the attacker’s shirt just enough to stop a clear shooting opportunity. The attacker falls.The foul is inside the penalty area.There is no attempt to play the ball.",
"Penalty + yellow",
"Penalty + red",
"Penalty only",
"Play on",
"B"
]
];

// -------------------------------------
let pos = 0;
let correctCount = 0;
let answers = [];
let timerInterval = null;
let totalTime = 900; // 15 minutes

// DOM refs
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionBox = document.getElementById("questionBox");
const progressEl = document.getElementById("progress");
const timeLeftEl = document.getElementById("timeLeft");

const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// restart removed intentionally
const downloadCsvBtn2 = document.getElementById("downloadCsvBtn2");
const downloadHtmlBtn2 = document.getElementById("downloadHtmlBtn2");

const finalScore = document.getElementById("finalScore");
const finalMessage = document.getElementById("finalMessage");

// -------------------------------------
// START QUIZ
// -------------------------------------
function startQuiz() {
  pos = 0;
  correctCount = 0;
  answers = new Array(questions.length).fill(null);

  hide(startScreen);
  show(quizScreen);

  totalTime = 900;
  startTimer();
  renderQuestion();
}

// -------------------------------------
// TIMER
function startTimer() {
updateTimerDisplay(); // show minutes immediately

timerInterval = setInterval(() => {
totalTime--;
if (totalTime <= 0) {
clearInterval(timerInterval);
submitQuiz();
} else {
updateTimerDisplay();
}
}, 1000);
}

function updateTimerDisplay() {
const minutes = Math.floor(totalTime / 60);
const seconds = totalTime % 60;
timeLeftEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;


const bar = document.getElementById("timeBar");
if(bar){
const percent = (totalTime / 900) * 100;
bar.style.width = percent + "%";
bar.style.background = percent > 50 ? "#718a02ff" : percent > 20 ? "#ffd700" : "#ff4f4f";
}
}

// -------------------------------------
// FINISH QUIZ
// -------------------------------------
function finishQuiz() {
  clearInterval(timerInterval);

  hide(quizScreen);
  show(resultScreen);

  correctCount = answers.filter(a => a && a.passed).length;

  finalScore.textContent = `You got ${correctCount} out of ${questions.length}`;
  finalMessage.textContent = "Test completed!";
}

// -------------------------------------
// RENDER QUESTION
// -------------------------------------
function renderQuestion() {
  const q = questions[pos];

  progressEl.textContent = `Question ${pos + 1} of ${questions.length}`;

  let html = `<h3>${q[0]}</h3>`;
  html += `<div class="choices">`;

  const labels = ["A", "B", "C", "D"];
  for (let i = 1; i <= 4; i++) {
    const optLetter = labels[i - 1];
    const saved = answers[pos]?.selected || null;

    html += `
      <label class="choice ${saved === optLetter ? "selected" : ""}" data-value="${optLetter}">
        <input type="radio" name="choices" value="${optLetter}" ${saved === optLetter ? "checked" : ""}>
        <span>${optLetter}. ${q[i]}</span>
      </label>
    `;
  }

  html += `</div>`;
  questionBox.innerHTML = html;

  // Click select
  questionBox.querySelectorAll(".choice").forEach(c => {
    c.addEventListener("click", () => {
      questionBox.querySelectorAll(".choice").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected");
      c.querySelector("input").checked = true;
    });
  });

  updateNavButtons();
}

// -------------------------------------
// SAVE ANSWER
// -------------------------------------
function saveCurrentAnswer() {
  const radios = document.getElementsByName("choices");
  let selected = null;

  for (const r of radios) {
    if (r.checked) {
      selected = r.value;
      break;
    }
  }

  answers[pos] = {
    question: questions[pos][0],
    options: {
      A: questions[pos][1],
      B: questions[pos][2],
      C: questions[pos][3],
      D: questions[pos][4]
    },
    selected: selected,
    correctAnswer: questions[pos][5],
    passed: selected === questions[pos][5]
  };
}

// -------------------------------------
// NAVIGATION
// -------------------------------------
function nextQuestion() {
  saveCurrentAnswer();

  if (pos < questions.length - 1) {
    pos++;
    renderQuestion();
  }
}

function prevQuestion() {
  saveCurrentAnswer();

  if (pos > 0) {
    pos--;
    renderQuestion();
  }
}

function submitQuiz() {
  saveCurrentAnswer();
  finishQuiz();
}

function updateNavButtons() {
  prevBtn.style.visibility = pos === 0 ? "hidden" : "visible";
  nextBtn.style.visibility = pos === questions.length - 1 ? "hidden" : "visible";
  submitBtn.style.display = pos === questions.length - 1 ? "inline-block" : "none";
}

// -------------------------------------
// UTIL
// -------------------------------------
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

// -------------------------------------
// CSV EXPORT
// -------------------------------------
function generateCsvContent() {
  const rows = [];
  rows.push(["Index", "Question", "Selected", "CorrectAnswer", "Result"]);

  answers.forEach((r, i) => {
    rows.push([
      i + 1,
      r.question.replace(/[\r\n]+/g, " "),
      r.selected || "",
      r.correctAnswer,
      r.passed ? "Passed" : "Failed"
    ]);
  });

  rows.push([]);
  rows.push(["Total Score", `${correctCount} / ${questions.length}`]);

  return rows
    .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
}

function downloadCSV() {
  const csv = generateCsvContent();
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "referee_test_results.csv";
  a.click();
}

// -------------------------------------
// HTML REPORT (Improved With Headers)
// -------------------------------------
function generateHtmlReport() {
  let rows = answers
    .map((r, i) => {
      return `
        <tr>
          <td>${i + 1}</td>
          <td>${r.question}</td>
          <td>${r.selected || "(none)"}</td>
          <td>${r.correctAnswer}</td>
          <td>${r.passed ? "Passed" : "Failed"}</td>
        </tr>
      `;
    })
    .join("");

  return `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { margin-bottom: 10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #555; padding: 8px; text-align: left; }
      th { background: #f0f0f0; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Referee LOTG Test Report</h1>
    <p><strong>Score:</strong> ${correctCount} / ${questions.length}</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Your Answer</th>
          <th>Correct Answer</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </body>
  </html>
  `;
}

function downloadHtmlReport() {
  const html = generateHtmlReport();
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "referee_test_report.html";
  a.click();
}

// -------------------------------------
// EVENTS
// -------------------------------------
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
submitBtn.addEventListener("click", submitQuiz);
// restart removed
downloadCsvBtn2.addEventListener("click", downloadCSV);
downloadHtmlBtn2.addEventListener("click", downloadHtmlReport);

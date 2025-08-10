let questions = [];
let currentIndex = 0;
let iq = 100;
let selected = null;

const questionText   = document.getElementById("question-text");
const optionsDiv     = document.getElementById("options");
const nextBtn        = document.getElementById("next-btn");
const currentEl      = document.getElementById("current");
const iqValueEl      = document.getElementById("iq-value");
const iqFill         = document.getElementById("iq-fill");
const quizBox        = document.getElementById("quiz-box");
const resultBox      = document.getElementById("result-box");
const finalIqEl      = document.getElementById("final-iq");

async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    questions = await res.json();
    if (questions.length !== 100) {
      alert("Pastikan questions.json berisi tepat 100 soal!");
      return;
    }
    renderQuestion();
  } catch (err) {
    questionText.textContent = "Gagal memuat soal. Pastikan questions.json valid.";
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  currentEl.textContent = currentIndex + 1;
  questionText.textContent = q.question;
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.dataset.index = idx;
    div.addEventListener("click", handleAnswer);
    optionsDiv.appendChild(div);
  });
  nextBtn.classList.add("hidden");
  selected = null;
}

function handleAnswer(e) {
  if (selected !== null) return;
  selected = +e.target.dataset.index;
  const correct = questions[currentIndex].answer;
  if (selected === correct) {
    iq += 0.5;
    e.target.classList.add("correct");
  } else {
    iq -= 0.2;
    e.target.classList.add("wrong");
    optionsDiv.children[correct].classList.add("correct");
  }
  updateIQ();
  nextBtn.classList.remove("hidden");
}

function updateIQ() {
  iq = Math.max(0, Math.round(iq * 10) / 10);
  iqValueEl.textContent = iq;
  iqFill.style.width = `${iq}%`;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalIqEl.innerHTML = `IQ Akhir: <strong>${iq}</strong>`;
}

nextBtn.addEventListener("click", nextQuestion);
loadQuestions();

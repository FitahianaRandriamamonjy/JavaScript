const sentence = document.querySelector(".sentence-to-write");
const textareaToTest = document.querySelector(".textarea-to-test");
let spansFromAPISentence;

const APIEndpoint = "https://api.quotable.io/random";
const fallbackQuotes = [
  "Tout expert était autrefois un débutant qui n'a jamais abandonné.",
  "Le succès n'est pas définitif, l'échec n'est pas fatal, c'est le courage de continuer qui compte.",
  "Croyez en vous et vous serez déjà à mi-chemin.",
  "Chaque minute passée à s'entraîner est une minute gagnée sur l'avenir.",
  "La persévérance est la clé qui ouvre toutes les portes fermées.",
  "Celui qui avance lentement mais sûrement finit toujours par arriver.",
  "Les grandes choses sont accomplies par ceux qui osent croire en leurs rêves.",
  "Il n'est jamais trop tard pour apprendre quelque chose de nouveau.",
  "La confiance en soi est le premier secret du succès.",
];

async function getNewSentence() {
  try {
    const response = await fetch(APIEndpoint);

    if (!response.ok) throw new Error("API indisponible");

    const { content } = await response.json();
    buildSentence(content);
  } catch (error) {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    buildSentence(fallbackQuotes[randomIndex]);
  }
}

function buildSentence(content) {
  sentence.textContent = "";

  content.split("").forEach((character) => {
    const spanCharacter = document.createElement("span");
    spanCharacter.textContent = character;
    sentence.appendChild(spanCharacter);
  });

  spansFromAPISentence = sentence.querySelectorAll(".sentence-to-write span");

  textareaToTest.value = "";
  locked = false;
}

getNewSentence();

const timeDisplayed = document.querySelector(".time");
const scoreDisplayed = document.querySelector(".score");

window.addEventListener("keydown", handleStart);

let time;
let score;
let timerID;

function handleStart(e) {
  if (e.key === "Escape") {
    if (timerID) {
      clearInterval(timerID);
      timerID = undefined;
    }

    time = 60;
    score = 0;

    timeDisplayed.classList.add("active");
    textareaToTest.classList.add("active");

    timeDisplayed.textContent = `Temps : ${time}`;
    scoreDisplayed.textContent = `Score : ${score}`;
    textareaToTest.value = "";

    getNewSentence();

    textareaToTest.removeEventListener("input", handleTyping);
    textareaToTest.addEventListener("input", handleTyping);
    textareaToTest.focus();
  }
}

let locked = false;
function handleTyping(e) {
  if (locked) return;

  if (!timerID) startTimer();

  const completedSentence = checkSpans();

  if (completedSentence) {
    locked = true;
    score += spansFromAPISentence.length;
    scoreDisplayed.textContent = `Score : ${score}`;
    getNewSentence();
  }
}

function startTimer() {
  timerID = setInterval(handleTime, 1000);
}

function handleTime() {
  time--;
  timeDisplayed.textContent = `Temps : ${time}`;

  if (time === 0) {
    clearInterval(timerID);
    timerID = undefined;

    timeDisplayed.classList.remove("active");
    textareaToTest.classList.remove("active");

    const currentCorrect = sentence.querySelectorAll(".correct").length;
    score += currentCorrect;

    scoreDisplayed.textContent = "Score final : " + score + " 🎉";
    textareaToTest.removeEventListener("input", handleTyping);

    sentence.innerHTML = `<em style="color:#edde5d">Partie terminée ! Appuyez sur Échap pour rejouer.</em>`;
  }
}

function checkSpans() {
  const textareaCharactersArray = textareaToTest.value.split("");
  let completedSentence = true;
  let currentGoodLetters = 0;

  for (let i = 0; i < spansFromAPISentence.length; i++) {
    if (textareaCharactersArray[i] === undefined) {
      spansFromAPISentence[i].className = "";
      completedSentence = false;
    } else if (
      textareaCharactersArray[i] === spansFromAPISentence[i].textContent
    ) {
      spansFromAPISentence[i].classList.remove("wrong");
      spansFromAPISentence[i].classList.add("correct");
      currentGoodLetters++;
    } else {
      spansFromAPISentence[i].classList.add("wrong");
      spansFromAPISentence[i].classList.remove("correct");
      completedSentence = false;
    }
  }

  scoreDisplayed.textContent = "Score : " + (score + currentGoodLetters);

  return completedSentence;
}

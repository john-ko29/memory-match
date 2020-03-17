var mainElement = document.getElementById("gameCards");
var modalElement = document.getElementById("modal");
var gamePlayedElement = document.getElementById("gamePlayed");
var attemptsElement = document.getElementById("attempts");
var accuracyElement = document.getElementById("accuracy");
var buttonElement = document.getElementById("resetGame");
var buttonElement2 = document.getElementById("resetGameOver");
var gameOverElement = document.getElementById("game-over")
var volumeElement = document.getElementById("bgm");
var healthBarElement = document.getElementById("hp-current");
var healthPercentageElement = document.getElementById("healthPerc");
var limitBreakMenuElement = document.getElementById("limitBreakMenu");
var limitBreakModalElement = document.getElementById("limitBreakModal");
var limitBreakElement = document.getElementById("limitBreak");
var changeDifficultyElement = document.getElementById("changeDifficulty");
var currentDifficultyElement = document.getElementById("difficulty");
var currentDifficulty = "Normal";
var hintElement = document.getElementById("hint");
var hintTextElement = document.getElementById("hintText");
var audioElement = document.createElement("audio");
var audio = {
  "victory": "assets/audio/final-fantasy-vii-victory-fanfare-1.mp3",
  "gameover": "assets/audio/gameover.mp3",
  "bgm": "assets/audio/bgm.mp3",
  "limitBreak": "assets/audio/limit-break.mp3"
};

var difficultyIndex = 1;
var difficulty = ["Easy",
                  "Normal",
                  "Hard"];

var cardFrontArray = ["buster-sword",
                  "buster-sword",
                  "revolver",
                  "revolver",
                  "pinwheel",
                  "pinwheel",
                  "mage-masher",
                  "mage-masher",
                  "brotherhood",
                  "brotherhood",
                  "blazefire",
                  "blazefire",
                  "braveheart",
                  "braveheart",
                  "hardedge",
                  "hardedge",
                  "broadsword",
                  "broadsword"]

var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;

var maxMatches = 9;
var matches = 0;

var attempts = 0;
var gamesPlayed = 0;
var live = 100;
var matchInRow = 0;
var limitBreak = false;

addListener();
displayStats();
shuffle();

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }
  removeHint()
  event.target.parentElement.classList.add("flip");
  var targetElement = event.target;
  setTimeout(function(){
    targetElement.classList.add("hidden");
  }, 300);


  if (!firstCardClicked) {
    firstCardClicked = event.target;
    firstCardClasses = event.target.previousElementSibling.className;
  } else {
    secondCardClicked = event.target;
    secondCardClasses = event.target.previousElementSibling.className;
    mainElement.removeEventListener("click", handleClick);
    if(firstCardClasses === secondCardClasses) {
      mainElement.addEventListener("click", handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
      matches++;
      attempts++;
      matchInRow++;
      flipCard();
      displayStats();
      if(matchInRow === 2 && matches !== maxMatches) {
          matchInRow = 0;
          toggleLimitBreak();
          setTimeout(toggleLimitBreak, 10000);
      }
      if(matches === maxMatches) {
        if (volumeElement.firstElementChild.className === "fa fa-volume-up") {
          toggleAudioIcon();
        }
        modalElement.classList.remove("hidden");
        playAudio(audio.victory);
        setTimeout(function() {
          stopAudio(audio.victory);
        }, 3500);
      }
    } else {
      setTimeout(hideCard, 1500);
      attempts++;
      if (limitBreak === false) {
      calculateDamage(currentDifficulty);
      }
      matchInRow = 0;
      if (live <= 0) {
        if (volumeElement.firstElementChild.className === "fa fa-volume-up") {
          toggleAudioIcon();
        }
        gameOverElement.classList.remove("hidden");
        playAudio(audio.gameover);
        setTimeout(function() {
          stopAudio(audio.gameover);
        }, 5000)
      }
      displayStats();
    }
  }
}

function hideCard() {
  firstCardClicked.classList.remove("hidden");
  secondCardClicked.classList.remove("hidden");
  firstCardClicked = null;
  secondCardClicked = null;
  mainElement.addEventListener("click", handleClick);
  flipCard();
}

function flipCard() {
  var flipCards = document.querySelectorAll(".flip");
  for (var index = 0; index < flipCards.length; index++) {
    flipCards[index].classList.remove("flip");
  }
}

function displayStats() {
  gamePlayedElement.textContent = gamesPlayed;
  attemptsElement.textContent = attempts;
  accuracyElement.textContent = calculateAccuracy(attempts, matches);
  calcHealthBar(live);
}

function calculateAccuracy(attempt, match){
  if(attempt === 0) {
    return 0 + "%";
  }
  return Math.trunc((match / attempt) * 100) + "%";
}

function resetGame() {
  matches = 0;
  attempts = 0;
  live = 100;
  gamesPlayed++;

  removeHint();
  displayStats();
  resetCards();
  modalElement.classList.add("hidden");
  gameOverElement.classList.add("hidden");
}

function resetCards() {
  var hiddenCards = document.querySelectorAll(".card-back");
  for(var index = 0; index < hiddenCards.length; index++) {
    hiddenCards[index].classList.remove("hidden");
  }
  shuffle();
}

function shuffle() {
  destroyChildren(mainElement);
  var cardArray = createCard(cardFrontArray)
  var newOrder = shuffleCards(cardArray);
  for(var index = 0; index < newOrder.length; index++) {
    mainElement.appendChild(newOrder[index]);
  }
}

function shuffleCards(cardArray) {
  var currentArray = []
  var newArray = []
  for (var i = 0; i < cardArray.length; i++) {
   currentArray[i] = cardArray[i];
  }
  while (currentArray[0]) {
    var randomPosition = Math.floor(Math.random() * currentArray.length);
    newArray.push(currentArray[randomPosition]);
    currentArray.splice(randomPosition, 1);
  }
  return newArray;
}

function destroyChildren(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createCard(cardArray) {
  var newArray = [];
  for(var index = 0; index < cardArray.length; index++) {
    var card = document.createElement("card");

    var cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.classList.add(cardFrontArray[index]);

    var cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    newArray[index] = card;
  }

  return newArray;
}

function playAudio(src) {
  audioElement.setAttribute("src", src);
  audioElement.play();
}

function stopAudio(src) {
  audioElement.setAttribute("src", src);
  audioElement.pause();
  audioElement.currentTime = 0.0;
}

function toggleAudioIcon() {
  var toggle = volumeElement.firstElementChild.className;
  volumeElement.firstElementChild.remove();
  var newToggle = document.createElement("i");
  if (toggle === "fa fa-volume-off") {
    newToggle.className = "fa fa-volume-up";
    playAudio(audio.bgm);
  }
  else {
    newToggle.className = "fa fa-volume-off";
    stopAudio(audio.bgm);
  }
  volumeElement.appendChild(newToggle);
}

function calcHealthBar(live) {
  if (live < 0) {
    live = 0;
  }
  var currentHealth = live;
  if (live <= 25) {
    healthBarElement.style.backgroundColor = "red";
  } else {
    healthBarElement.style.backgroundColor = "#82D1FD"
  }
  var percentageHealth = currentHealth + "%"
  healthPercentageElement.textContent = percentageHealth
  healthBarElement.style.width = percentageHealth;
}

function toggleLimitBreak(){
  if(limitBreak === false) {
    limitBreak = true;
    limitBreakElement.textContent = "On";
    playAudio(audio.limitBreak);
  } else if (limitBreak === true) {
    limitBreak = false;
    limitBreakElement.textContent = "Off";
  }
}

function changeDifficulty() {
  if (difficultyIndex % 3 === 0) {
    difficultyIndex++;
    currentDifficulty = difficulty[1];
  } else if (difficultyIndex % 3 === 1) {
    difficultyIndex++;
    currentDifficulty = difficulty[2];
  } else {
    difficultyIndex++;
    currentDifficulty = difficulty[0];
  }
  currentDifficultyElement.textContent = currentDifficulty;
}

function calculateDamage(difficulty) {
  if (difficulty === "Easy") {
    live -= 5;
  } else if (difficulty === "Normal") {
    live -= 10;
  } else if (difficulty == "Hard") {
    live -= 20;
  }
}

function clickHint() {
  removeHint()
  var allHidden = document.querySelectorAll(".card-back:not(.hidden)");
  var randomNumber = Math.floor(Math.random() * allHidden.length);
  var cardHintClass = allHidden[randomNumber].previousElementSibling.className;
  var cardHint = cardHintClass.slice(11);
  cardHint = cardHint.replace("-", " ")
  hintTextElement.textContent = cardHint;
  allHidden[randomNumber].parentElement.classList.add("hintCard");
}

function removeHint() {
  var cardHint = document.querySelector(".hintCard");
  if (cardHint !== null) {
    cardHint.classList.remove("hintCard");
  }
  hintTextElement.textContent = "";
}

function showExplanation() {
  limitBreakModalElement.classList.remove("hidden");
}

function hideExplanation() {
  limitBreakModalElement.classList.add("hidden");
}

function addListener() {
  mainElement.addEventListener("click", handleClick);
  buttonElement.addEventListener("click", resetGame);
  buttonElement2.addEventListener("click", resetGame);
  volumeElement.addEventListener("click", toggleAudioIcon);
  changeDifficultyElement.addEventListener("click", changeDifficulty);
  hintElement.addEventListener("click", clickHint);
  limitBreakMenuElement.addEventListener("mouseover", showExplanation);
  limitBreakMenuElement.addEventListener("mouseout", hideExplanation);
}

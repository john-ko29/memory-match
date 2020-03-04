var mainElement = document.getElementById("gameCards");
mainElement.addEventListener("click", handleClick);
var modalElement = document.getElementById("modal");
var gamePlayedElement = document.getElementById("gamePlayed");
var attemptsElement = document.getElementById("attempts");
var accuracyElement = document.getElementById("accuracy");
var buttonElement = document.getElementById("resetGame");
buttonElement.addEventListener("click", resetGame);

var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;

var maxMatches = 9;
var matches = 0;

var attempts = 0;
var gamesPlayed = 0;
displayStats();
shuffle();

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }
  var targetElement = event.target;
  targetElement.classList.add("hidden");

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
      displayStats();
      if(matches === maxMatches) {
        modalElement.classList.remove("hidden");
      }
    } else {
      setTimeout(hideCard, 1500);
      attempts++;
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
}

function displayStats() {
  gamePlayedElement.textContent = gamesPlayed;
  attemptsElement.textContent = attempts;
  accuracyElement.textContent = calculateAccuracy(attempts, matches);
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
  gamesPlayed++;

  displayStats();
  resetCards();
  modalElement.classList.add("hidden");
}

function resetCards() {
  var hiddenCards = document.querySelectorAll(".card-back");
  for(var index = 0; index < hiddenCards.length; index++) {
    hiddenCards[index].classList.remove("hidden");
  }
  shuffle();
}

function shuffle() {
  var cardArray = document.querySelectorAll("card.col-2");
  destroyChildren(mainElement);
  var newOrder = shuffleCards(cardArray);
  for(var index = 0; index < newOrder.length; index++) {
    mainElement.appendChild(newOrder[index]);
  }
}

function shuffleCards(cardArray) {
  // for(var index = 0; index < cardArray.length; index++) {
  //   var randomPosition = Math.floor(Math.random() * cardArray.length);
  //   var placeHolder = cardArray[index];
  //   cardArray[index] = cardArray[randomPosition];
  //   cardArray[randomPosition] = placeHolder;
  // }
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

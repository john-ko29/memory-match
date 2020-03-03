var mainElement = document.getElementById("gameCards");
mainElement.addEventListener("click", handleClick);

var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;

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
    } else {
      setTimeout(hideCard, 1500);
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

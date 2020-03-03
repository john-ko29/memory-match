var mainElement = document.getElementById("gameCards");

mainElement.addEventListener("click", handleClick);

function handleClick(event) {
  if(event.target.className.indexOf("card-back") === -1) {
    return;
  }
  var targetElement = event.target;
  targetElement.classList.add("hidden");
  console.log("event: ", event);
}

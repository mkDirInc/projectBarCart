const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = "/api/json/v1/1/search.php?s=";
cocktailApp.searchTypes.ingredient = "/api/json/v1/1/filter.php?i=";
cocktailApp.endpoint = "https://www.thecocktaildb.com";
cocktailApp.ingredientPath = "/api/json/v1/1/filter.php";
cocktailApp.form = document.querySelector("form");
cocktailApp.drinkList = document.querySelector(".drink__list");
cocktailApp.userInput = document.getElementById("search-bar");

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

cocktailApp.getFetchURL = function () {
  const searchTerm = this.userInput.value;
  const searchTypeChoice = document.querySelector(
    'input[name="search-type"]:checked'
  ).value;

  return `${this.endpoint}${this.searchTypes[searchTypeChoice]}${searchTerm}`;
};

// Get user's input and fetch the data from API
cocktailApp.getIngredientName = function () {
  cocktailApp.form.addEventListener("submit", (e) => {
    e.preventDefault();

    fetch(this.getFetchURL())
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(
            `This seems like invalid ingredient. Please try another one`
          );
        }
      })
      .then((drinkData) => {
        cocktailApp.displayDrinks(drinkData);
      })
      .catch((err) => {
        // If we have time, we can make an img display
        alert(`This seems like invalid ingredient. Please try another one`);
      });
  });
};

cocktailApp.displayDrinks = function (data) {
  // Saving this in the cocktailApp namespace so that we can populate cardbacks with it on demand.
  this.drinks = data.drinks;
  this.drinkList.innerHTML = "";
  this.drinks.forEach((drink) => {
    const drinkName = drink.strDrink;
    const drinkImg = drink.strDrinkThumb;

    const listElement = document.createElement("li");
    listElement.id = drink.idDrink;
    listElement.classList.add("drink");
    listElement.innerHTML = `
      <div class="drink__content">
        <div class="front drink__list--result">
          <img class="front__img drink__list--thumbnail" src="${drinkImg}/preview" alt="Photo of ${drinkName}">
          <h3 class="front__name drink__list--name">${drinkName}</p>
        </div>
        <div class="back">
        </div>
      </div>
    `;
    listElement.addEventListener("click", cocktailApp.handleCardClick);
    // const drinkResultList = document.createElement('li');
    // drinkResultList.classList.add('drink__list--result');

    // const drinkResultImg = document.createElement('img');
    // drinkResultImg.classList.add('drink__list--thumbnail');

    // const drinkResultName = document.createElement('p');
    // drinkResultName.classList.add('drink__list--name');

    // drinkResultImg.src = `${drinkImg}`;
    // drinkResultImg.alt = `${drinkName}`;
    // drinkResultName.innerHTML = `${drinkName}`;

    // drinkResultList.append(drinkResultImg, drinkResultName);
    cocktailApp.drinkList.append(listElement);
  });
};

cocktailApp.handleCardClick = function () {
  const cardBack = this.querySelector(".back");
  const drinkId = this.id;
  if (cardBack.childElementCount === 0) {
    cocktailApp.fillCardBack(drinkId, cardBack);
  }
  this.classList.toggle("flipped");
};

cocktailApp.fillCardBack = function (drinkId, cardBack) {
  const index = this.drinks.findIndex((drink) => drink.idDrink === drinkId);
  const drinkData = this.drinks[index];
  if (drinkData.strIngredient1 === undefined) {
    // logic for another fetch call goes here
    return;
  }
  console.log(cardBack);
  cardBack.innerHTML = `
    <div class="back__title">
      <img class="back__img" src="${drinkData.strDrinkThumb}/preview" alt="Photo of a Gin Fizz">
      <h3 class="back__name">Gin Fizz</h3>
    </div>
    <div class="back__recipe">
      <h4 class="back__heading">Ingredients</h4>
      <ul class="back__ingredients"></ul>
      <h4 class="back__heading">Instructions</h4>
      <p class="back__instructions">${drinkData.strInstructions}</p>
    </div>
  `;
  const ingredientList = cardBack.querySelector('.ingredients');
  for (let i = 1; i < 16; i += 1) {
    const ingredient = drinkData[`strIngredient${i}`];
    if (ingredient === null) break;

    console.log(ingredient);
    const measure = drinkData[`strMeasure${i}`];
    document.createElement('li');
  }
};

cocktailApp.init();


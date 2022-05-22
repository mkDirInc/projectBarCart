const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = "/api/json/v1/1/search.php?s=";
cocktailApp.searchTypes.ingredient = "/api/json/v1/1/filter.php?i=";
cocktailApp.endpoint = "https://www.thecocktaildb.com";
cocktailApp.form = document.querySelector("form");
cocktailApp.drinkList = document.querySelector(".drink__list");
cocktailApp.userInput = document.getElementById("search-bar");

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

// Compiles and returns fetch URL based on user's search parameters.
cocktailApp.getFetchURL = function () {
  const searchTerm = this.userInput.value;
  const searchTypeChoice = document.querySelector(
    'input[name="search-type"]:checked'
  ).value;

  return `${this.endpoint}${this.searchTypes[searchTypeChoice]}${searchTerm}`;
};

// This adds an event listener to form submission:
// On submit: fetch searched data from API and passes it on to be displayed.
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

// For each drink in the provided data, this appends a card to .drink__list.
// Each card is given a click event listener so that it can be flipped to its instructions side
cocktailApp.displayDrinks = function (data) {

  // Caching drink data into the cocktailApp namespace so that it can be used to fill card backs later.
  this.drinks = data.drinks;
  // Empty drink list before appending new drinks
  this.drinkList.innerHTML = "";
  // Append click-ready cards to .drink__list
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
    listElement.addEventListener("click", cocktailApp.handleCardClick);
    cocktailApp.drinkList.append(listElement);
  });
};

cocktailApp.handleCardClick = function () {
  const cardBack = this.querySelector(".back");
  const drinkId = this.id;
  if (cardBack.childElementCount === 0) {
    cocktailApp.confirmDrinkData(drinkId, cardBack);
  }
  this.classList.toggle("flipped");
};

cocktailApp.confirmDrinkData = async function (drinkId, cardBack) {
  const index = this.drinks.findIndex((drink) => drink.idDrink === drinkId);
  const thisDrink = this.drinks[index];
  if (thisDrink.strIngredient1) {
    this.fillCardBack(cardBack, thisDrink);
    return;
  }
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error(
          `Our drink monkeys couldn't find anything. :(`
        );
      }
    })
    .then((drinkData) => {
      // thisDrink = drinkData.drinks[0];
      this.drinks[index] = drinkData.drinks[0];
      this.fillCardBack(cardBack, this.drinks[index]);
    })
    .catch((err) => {
      alert(`Our drink monkeys couldn't find anything. :(`);
    });
  // this.fillCardBack(cardBack, thisDrink);
};

cocktailApp.fillCardBack = function (cardBack, thisDrink) {
  cardBack.innerHTML = `
    <div class="back__title">
      <img class="back__img" src="${thisDrink.strDrinkThumb}/preview" alt="Photo of a ${thisDrink.strDrink}">
      <h3 class="back__name">${thisDrink.strDrink}</h3>
    </div>
    <div class="back__recipe">
      <h4 class="back__heading">Ingredients</h4>
      <ul class="back__ingredients"></ul>
      <h4 class="back__heading">Instructions</h4>
      <p class="back__instructions">${thisDrink.strInstructions}</p>
    </div>
  `;
  for (let i = 1; i < 16; i += 1) {
    const ingredient = thisDrink[`strIngredient${i}`];
    if (ingredient === null) break;
    const ingredientListElement = document.createElement('li');
    const measure = thisDrink[`strMeasure${i}`];
    if (measure) {
      ingredientListElement.textContent = `${measure} ${ingredient}`;
    } else {
      ingredientListElement.textContent = ingredient;
    }
    const ingredientList = cardBack.querySelector('.back__ingredients');
    ingredientList.append(ingredientListElement);
  }
}

cocktailApp.fetchById = async function(drinkId) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error(
          `Our drink monkeys couldn't find anything. :(`
        );
      }
    })
    .then((drinkData) => {
      return drinkData[0];
    })
    .catch((err) => {
      alert(`Our drink monkeys couldn't find anything. :(`);
    })
}

cocktailApp.init();


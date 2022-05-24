const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = '/api/json/v1/1/search.php?s=';
cocktailApp.searchTypes.ingredient = '/api/json/v1/1/filter.php?i=';
cocktailApp.endpoint = 'https://www.thecocktaildb.com';
cocktailApp.form = document.querySelector('form');
cocktailApp.drinkList = document.querySelector('.drink__list');
cocktailApp.userInput = document.getElementById('search-bar');

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
  cocktailApp.form.addEventListener('submit', (e) => {
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
  this.drinkList.innerHTML = '';
  // Append click-ready cards to .drink__list
  this.drinks.forEach((drink) => {
    const drinkName = drink.strDrink;
    const drinkImg = drink.strDrinkThumb;

    const listElement = document.createElement('li');
    listElement.id = drink.idDrink;
    listElement.classList.add('drink');
    // Note to Jay: I believe using innerHTML is fine here, as all content is provided by the API, rather than the user. I could be wrong. Let me know what you think.
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
    listElement.addEventListener('click', cocktailApp.handleCardClick);
    cocktailApp.drinkList.append(listElement);
  });
};

// This callback function supplied to card event listeners.
cocktailApp.handleCardClick = function () {
  const cardBack = this.querySelector('.back');
  // If the cardback has no content, send it through control flow that confirms the data, then displays it.
  if (cardBack.childElementCount === 0) {
    cocktailApp.confirmDrinkData(this.id, cardBack);
  }
  this.classList.toggle('flipped');
};

// This confirms that the cached drinked data is complete before passing it along fillCardBack().
cocktailApp.confirmDrinkData = function (drinkId, cardBack) {
  // Use the drink id to find it in the cached data.
  const index = this.drinks.findIndex((drink) => drink.idDrink === drinkId);
  const thisDrink = this.drinks[index];
  // If the data has at least one ingredient, it is considered complete and ready to display.
  if (thisDrink.strIngredient1) {
    this.fillCardBack(cardBack, thisDrink);
    return;
  }
  // Otherwise, fetch updated drink details from the API.
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error(`Our drink monkeys couldn't find anything. Sorry. :(`);
      }
    })
    .then((drinkData) => {
      this.drinks[index] = drinkData.drinks[0];
      this.fillCardBack(cardBack, this.drinks[index]);
    })
    .catch((err) => {
      alert(`Our drink monkeys couldn't find anything. Sorry. :(`);
    });
};

// Fills the innerHTML of a clicked card's cardback
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
  // Compiles the drink's list of ingredients and optional measures.
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

cocktailApp.init();
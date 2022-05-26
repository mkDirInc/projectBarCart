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

    // Create list element and its HTML
    const listElement = document.createElement('li');
    listElement.id = drink.idDrink;
    listElement.classList.add('drink');
    listElement.innerHTML = `
      <div class="drink__content">
        <div class="front drink__list--result">
          <img class="front__img drink__list--thumbnail" loading="lazy" />
          <h3 class="front__name drink__list--name"></h3>
        </div>
        <div class="back">
        </div>
      </div>
    `;
    
    // Pass API content to list's HTML elements
    const frontImg = listElement.querySelector('.front__img');
    frontImg.src = `${drink.strDrinkThumb}/preview`;
    frontImg.alt = `Photo of a ${drink.strDrink}`;
    const frontName = listElement.querySelector('.front__name');
    frontName.textContent = drink.strDrink;

    // Add an event listener and append to the page
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

  // Fill the cardBack's HTML
  cardBack.innerHTML = `
    <div class="back__title">
      <img class="back__img" loading="lazy" />
      <h3 class="back__name"></h3>
    </div>
    <div class="back__recipe">
      <h4 class="back__heading">Ingredients</h4>
      <ul class="back__ingredients"></ul>
      <h4 class="back__heading">Instructions</h4>
      <p class="back__instructions"></p>
    </div>
  `;

  // Pass API content to the cardBack's HTML elements
  const backImg = cardBack.querySelector('.back__img');
  backImg.src = `${thisDrink.strDrinkThumb}/preview`;
  backImg.alt = `Photo of a ${thisDrink.strDrink}`;
  const backName = cardBack.querySelector('.back__name');
  backName.textContent = thisDrink.strDrink;
  backName.classList.add(this.getCardBackFontClass(thisDrink.strDrink));
  const backInstructions = cardBack.querySelector('.back__instructions');
  backInstructions.textContent = thisDrink.strInstructions
  
  // Compile the drink's list of ingredients and optional measures
  const backIngredients = cardBack.querySelector('.back__ingredients');
  for (let i = 1; i < 16; i += 1) {
    const ingredient = thisDrink[`strIngredient${i}`];
    // If there are no ingredients left to add, quit the for loop
    if (ingredient === null) break;
    
    const ingredientListElement = document.createElement('li');
    
    const measure = thisDrink[`strMeasure${i}`];
    if (measure) {
      ingredientListElement.textContent = `${measure} ${ingredient}`;
    } else {
      ingredientListElement.textContent = ingredient;
    }
    
    backIngredients.append(ingredientListElement);
  }
}

cocktailApp.getCardBackFontClass = function(strDrink) {
  if (strDrink.length < 10) return 'back__name--short';
  if (strDrink.length < 14) return 'back__name--medium';
  if (strDrink.length < 22) return 'back__name--long';
  return 'back__name--xlong';
}

cocktailApp.init();
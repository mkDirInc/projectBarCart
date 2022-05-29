const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = '/api/json/v1/1/search.php?s=';
cocktailApp.searchTypes.ingredient = '/api/json/v1/1/filter.php?i=';
cocktailApp.endpoint = 'https://www.thecocktaildb.com';
cocktailApp.form = document.querySelector('form');
cocktailApp.drinkSection = document.querySelector('.drinks')
cocktailApp.drinksList = document.querySelector('.drinks__list');
cocktailApp.userInput = document.getElementById('search-bar');
cocktailApp.submitButton = cocktailApp.form.querySelector('button');
cocktailApp.carouselButtons = document.querySelectorAll('[data-button]');

cocktailApp.init = () => {
  cocktailApp.prepareSubmitListener();
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
cocktailApp.prepareSubmitListener = function () {
  cocktailApp.form.addEventListener('submit', (e) => {
    e.preventDefault();

    this.submitButton.classList.toggle('button--clicked');
    
    fetch(this.getFetchURL())
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(
            `We couldn't find anything that matched your search term. How about a random cocktail?`
          );
        }
      })
      .then((drinkData) => {
        cocktailApp.displayDrinks(drinkData);
      })
      .catch((err) => {
        cocktailApp.getRandomCocktail();
      });
  });
};

cocktailApp.getRandomCocktail = function() {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error(
          `No response from Cocktail API.`
        );
      }
    })
    .then((drinkData) => {
      cocktailApp.displayDrinks(drinkData);
    })
    .catch((err) => {
      console.log(`Our drink monkeys couldn't find anything. Sorry. :(`, err);
    });
}

// For each drink in the provided data, this appends a card to <ul class="drink__list".>
// Each card is given a click event listener so that it can be flipped to its instructions side
cocktailApp.displayDrinks = function (data) {

  // Caching drink data into the cocktailApp namespace so that it can be used to fill card backs later.
  this.drinks = data.drinks;
  // Empty drink list before appending new drinks
  this.drinksList.innerHTML = '';
  // Append click-ready cards to .drink__list
  this.drinks.forEach((drink) => {

    // Create list element and its HTML
    const listElement = document.createElement('li');
    listElement.id = drink.idDrink;
    listElement.classList.add('drink');
    listElement.innerHTML = `
      <div class="drink__content">
        <div class="front">
          <img class="front__img" loading="lazy" />
          <h3 class="front__name"></h3>
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
    cocktailApp.drinksList.append(listElement);
  });

  // carousel function
  // giving the first child element (li) a class of "drink__pic--current"
  const firstDrink = cocktailApp.drinksList.children[0]
  firstDrink.classList.add('drink__pic--current');
  cocktailApp.changeDrinkSectionHeight(firstDrink);

  cocktailApp.carouselButtons.forEach(button => {
    // adding function to show button on the page once results are found
    button.classList.remove('drinks__button--hidden');
    button.addEventListener('click', () => {
      // button.classList.add('.drink__button--clicked');
      // this gives the offset value depends on the values of dataset
      const offset = button.dataset.button === "next" ? 1 : -1;
      // declaring currentPic of li which has 'date-active' attribute
      const currentPic = this.drinksList.querySelector('.drink__pic--current');
      const picList = Array.from(this.drinksList.children);
      // by setting a new index number, we remove and re-assign the drink__pic--current class to the nxt/prev li element and then loop the list within
      let newIndex = picList.indexOf(currentPic) + offset;
      if (newIndex < 0) {
        newIndex = picList.length - 1;
      }
      if (newIndex >= picList.length) {
        newIndex = 0;
      }
      picList[newIndex].classList.add('drink__pic--current');
      cocktailApp.changeDrinkSectionHeight(picList[newIndex]);
      currentPic.classList.remove('drink__pic--current');
    })
  })
};

// This callback function supplied to card event listeners.
cocktailApp.handleCardClick = function () {
  const cardBack = this.querySelector('.back');
  // If the cardback has no content, send it through control flow that confirms the data, then displays it.
  if (cardBack.childElementCount === 0) {
    cocktailApp.confirmDrinkData(this.id, cardBack);
  } else {
  // Otherwise, change element classes to animate flip.
  cocktailApp.changeFlipClasses(this);
  }
};

cocktailApp.changeFlipClasses = function(drinkElement) {
  drinkElement.classList.toggle('drink--flipped');
  console.log(drinkElement);
  const cardBack = drinkElement.querySelector('.back');
  setTimeout(function() {
    cardBack.querySelector('.back__recipe').classList.toggle('back__recipe--flipped');
    cardBack.querySelector('.back__title').classList.toggle('back__title--flipped');
  }, 1);
  cocktailApp.changeDrinkSectionHeight(drinkElement);
}

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
        throw new Error(`Nothing found with that search term.`);
      }
    })
    .then((drinkData) => {
      this.drinks[index] = drinkData.drinks[0];
      this.fillCardBack(cardBack, this.drinks[index]);
    })
    .catch((err) => {
      console.log(`Our drink monkeys couldn't find anything. Sorry. :(`, err);
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
    if (ingredient === null || ingredient === '') break;
    
    const ingredientListElement = document.createElement('li');
    
    const measure = thisDrink[`strMeasure${i}`];
    if (measure) {
      ingredientListElement.textContent = `${measure} ${ingredient}`;
    } else {
      ingredientListElement.textContent = ingredient;
    }
    
    backIngredients.append(ingredientListElement);
  }
  // Traverse the DOM to the card's list element and apply the classes needed to flip the card for the first time.
  const listElement = cardBack.parentElement.parentElement;
  this.changeFlipClasses(listElement);  
}

// Changes the height of the drink section based on the size of the card being flipped to.
cocktailApp.changeDrinkSectionHeight = function(element) {
  let frontFacingCard;
  if (element.classList.contains('drink--flipped')) {
    frontFacingCard = element.querySelector('.back'); 
  } else {
    frontFacingCard = element.querySelector('.front');
  }
  const drinkSectionHeight = this.drinkSection.style.height.slice(0, -2);
  const cardHeightRequirement = frontFacingCard.clientHeight * 2;
  if (drinkSectionHeight < cardHeightRequirement || drinkSectionHeight === undefined) {
    this.drinkSection.style.height = `${cardHeightRequirement}px`;
  };
}

cocktailApp.getCardBackFontClass = function(strDrink) {
  if (strDrink.length < 10) return 'back__name--short';
  if (strDrink.length < 14) return 'back__name--medium';
  if (strDrink.length < 22) return 'back__name--long';
  return 'back__name--xlong';
}

cocktailApp.init();
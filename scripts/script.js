const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = '/api/json/v1/1/search.php?s=';
cocktailApp.searchTypes.ingredient = '/api/json/v1/1/filter.php?i=';
cocktailApp.endpoint = 'https://www.thecocktaildb.com';
cocktailApp.form = document.querySelector('form');
cocktailApp.searchBar = document.getElementById('search-bar');
cocktailApp.submitButton = cocktailApp.form.querySelector('button');
cocktailApp.drinkSection = document.querySelector('.drinks')
cocktailApp.drinksList = document.querySelector('.drinks__list');
cocktailApp.popup = document.querySelector('.popup__container');
cocktailApp.popupButton = cocktailApp.popup.querySelector('.popup__button');
cocktailApp.carouselButtons = document.querySelectorAll('[data-button]');
cocktailApp.alertPopup = document.querySelector('.popup__alert');
cocktailApp.alertButton = cocktailApp.alertPopup.querySelector('.alert__button');
cocktailApp.drinkSectionHeading = cocktailApp.drinkSection.querySelector('.drinks__heading');

cocktailApp.init = () => {
  cocktailApp.prepareSubmitListener();
  cocktailApp.changePlaceholderText();
};

cocktailApp.changePlaceholderText = function() {
  this.form.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-placeholder')) {
      cocktailApp.searchBar.setAttribute('placeholder', e.target.dataset.placeholder);
    };
  });
};

// Compiles and returns fetch URL based on user's search parameters.
cocktailApp.getFetchURL = function () {
  const searchTerm = this.searchBar.value;
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
    // hide the drink section heading, if revealed, in case of an erroneous search
    this.drinkSectionHeading.classList.add('drinks__heading--hidden');
    // Get appropriate URL based on user selection and FETCH!
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
        cocktailApp.displayPopup();
      });
    });
};

// Displays a pop up that lets the user that no search results were found. Clicking on the displayed button fetches a random cocktail.
cocktailApp.displayPopup = function () {
  // Wipe the drinkList
  this.drinksList.innerHTML = '';
  // Reveal the popup
  this.popup.classList.remove('popup__container--hidden')
  
  this.popupButton.addEventListener('click', () => {
    this.getRandomCocktail();
    // Hide the popup
    this.popup.classList.add('popup__container--hidden');
  })
}

// Does what it says!
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
      cocktailApp.displayAlertPopup();
    });
}

// adding alert-popup function
cocktailApp.displayAlertPopup = function () {
  this.alertPopup.classList.remove('popup__alert--hidden')

  this.alertButton.addEventListener('click', () => {
    this.alertPopup.classList.add('popup__alert--hidden');
  })
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
    listElement.setAttribute('tabindex', '0');
    listElement.setAttribute('title', `Click to see this drink's recipe!`)
    listElement.classList.add('drink');
    listElement.setAttribute('aria-role', 'button');
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
    listElement.addEventListener('keyup', cocktailApp.handleKeyup);
    listElement.addEventListener('focus', cocktailApp.handleFocus);
    this.drinksList.append(listElement);
    // Reveal section heading
    this.drinkSectionHeading.classList.remove('drinks__heading--hidden');
  });

  this.prepareCarousel();
};

// carousel function, adapted from Web Dev Simplified tutorial
cocktailApp.prepareCarousel = function () {
  // giving the first child element (li) a class of "drink--current"
  const firstDrink = cocktailApp.drinksList.children[0]
  firstDrink.classList.add('drink--current');
  cocktailApp.adjustDrinkSectionHeight(firstDrink);

  cocktailApp.carouselButtons.forEach(button => {
    // adding function to show button on the page once results are found
    if (cocktailApp.drinksList.children.length !== 1) {
    button.classList.remove('drinks__button--hidden');
    } else {
      button.classList.add('drinks__button--hidden');
    }
    button.addEventListener('click', () => {
      // this gives the offset value depends on the values of dataset
      const offset = button.dataset.button === "next" ? 1 : -1;
      // declaring currentPic of li which has 'date-active' attribute
      const currentPic = this.drinksList.querySelector('.drink--current');
      const picList = Array.from(this.drinksList.children);
      // by setting a new index number, we remove and re-assign the drink--current class to the nxt/prev li element and then loop the list within
      let newIndex = picList.indexOf(currentPic) + offset;
      if (newIndex < 0) {
        newIndex = picList.length - 1;
      }
      if (newIndex >= picList.length) {
        newIndex = 0;
      }
      picList[newIndex].classList.add('drink--current');
      cocktailApp.adjustDrinkSectionHeight(picList[newIndex]);
      currentPic.classList.remove('drink--current');
    })
  })
}


// This callback function supplied to card event listeners to fill card back and flip card
// 3D card adapted from Kevin Powell tutorial
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

cocktailApp.handleKeyup = function (e) {
  if (e.key === 'Enter') {
    const cardBack = this.querySelector('.back');
    // If the cardback has no content, send it through control flow that confirms the data, then displays it.
    if (cardBack.childElementCount === 0) {
      cocktailApp.confirmDrinkData(this.id, cardBack);
    } else {
    // Otherwise, change element classes to animate flip.
    cocktailApp.changeFlipClasses(this);
    }
  } 
}

cocktailApp.handleFocus = function (e) {
  const currentPic = document.querySelector('.drink--current');
  currentPic.classList.remove('drink--current');
  this.classList.add('drink--current');
}

// Changes the classes on a flipping card to animate it.
cocktailApp.changeFlipClasses = function(drinkElement) {
  drinkElement.classList.toggle('drink--flipped');
  
  const cardBack = drinkElement.querySelector('.back');
  setTimeout(function() {
    cardBack.querySelector('.back__recipe').classList.toggle('back__recipe--flipped');
    cardBack.querySelector('.back__title').classList.toggle('back__title--flipped');
  }, 1);
  cocktailApp.adjustDrinkSectionHeight(drinkElement);
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
      cocktailApp.displayAlertPopup();
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
cocktailApp.adjustDrinkSectionHeight = function(element) {
  let frontFacingCard;
  if (element.classList.contains('drink--flipped')) {
    frontFacingCard = element.querySelector('.back');
    this.drinkSection.style.height = `${frontFacingCard.clientHeight * 1.5}px`;
  } else {
    frontFacingCard = element.querySelector('.front');
    this.drinkSection.style.height = `${frontFacingCard.clientHeight * 2.5}px`;
  }
}

// Supplies class names based on length of drink name.
cocktailApp.getCardBackFontClass = function(strDrink) {
  if (strDrink.length < 10) return 'back__name--short';
  if (strDrink.length < 14) return 'back__name--medium';
  if (strDrink.length < 22) return 'back__name--long';
  return 'back__name--xlong';
}

cocktailApp.init();
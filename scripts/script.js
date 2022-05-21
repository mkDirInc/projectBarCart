const cocktailApp = {};
cocktailApp.drinks = {};
cocktailApp.searchTypes = {};
cocktailApp.searchTypes.name = '/api/json/v1/1/search.php?s=';
cocktailApp.searchTypes.ingredient = '/api/json/v1/1/filter.php?i=';
cocktailApp.endpoint = 'https://www.thecocktaildb.com';
cocktailApp.ingredientPath = '/api/json/v1/1/filter.php';
cocktailApp.form = document.querySelector('form');
cocktailApp.drinkList = document.querySelector('.drink__list');
cocktailApp.userInput = document.getElementById('search-bar');

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

cocktailApp.getFetchAddress = function() {
  const searchTerm = this.userInput.value;
  const searchTypeChoice = document.querySelector('input[name="search-type"]:checked').value;
  
  return `${this.endpoint}${this.searchTypes[searchTypeChoice]}${searchTerm}`;
}

// Get user's input and fetch the data from API
cocktailApp.getIngredientName = function() {
  
  cocktailApp.form.addEventListener('submit', (e) => {
    e.preventDefault();
        
    fetch(this.getFetchAddress())
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`This seems like invalid ingredient. Please try another one`);
        }
      })
      .then((drinkData) => {
        cocktailApp.displayDrinks(drinkData);
      })
      .catch((err) => {
        // If we have time, we can make an img display
        alert(`This seems like invalid ingredient. Please try another one`);
      })
  })
}

cocktailApp.displayDrinks = function(data) {
  
  // Saving this in the cocktailApp namespace so that we can populate cardbacks with it on demand.
  this.drinks = data.drinks;

  this.drinks.forEach((drink) => {
    
    const drinkName = drink.strDrink;
    const drinkImg = drink.strDrinkThumb;
    
    const drinkResultList = document.createElement('li');
    drinkResultList.classList.add('drink__list--result');
    
    const drinkResultImg = document.createElement('img');
    drinkResultImg.classList.add('drink__list--thumbnail');
    
    const drinkResultName = document.createElement('p');
    drinkResultName.classList.add('drink__list--name');
    
    drinkResultImg.src = `${drinkImg}`;
    drinkResultImg.alt = `${drinkName}`;
    drinkResultName.innerHTML = `${drinkName}`;
    
    drinkResultList.append(drinkResultImg, drinkResultName);
    cocktailApp.drinkList.append(drinkResultList);
  })
}


cocktailApp.init();
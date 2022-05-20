const cocktailApp = {};

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

cocktailApp.form = document.querySelector('form');
cocktailApp.drinkList = document.querySelector('.drink__list');
cocktailApp.userInput = document.getElementById('search-bar');

// Get user's input and fetch the data from API
cocktailApp.getIngredientName = function() {
  
  cocktailApp.form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    cocktailApp.drinkList.innerHTML = '';
    // Just left this in here for now
    // when fxn inputUrl is declared, we can delete this and change the fetch structure
    const ingredientType = cocktailApp.userInput.value;
  
    // fetch(`inputUrl`)
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientType}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`This seems like invalid ingredient. Please try another one`);
      }
    }).then((drinkData) => {
      cocktailApp.displayDrinks(drinkData);
    }).catch((err) => {
      // If we have time, we can make an img display
      alert(`This seems like invalid ingredient. Please try another one`);
    })
  })
}

cocktailApp.displayDrinks = function(data) {
  
  const drinkResult = data.drinks;
  
  drinkResult.forEach((drink) => {
    
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
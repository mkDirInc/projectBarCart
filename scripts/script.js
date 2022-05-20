const cocktailApp = {};

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

// Get user's input and fetch the data from API
cocktailApp.getIngredientName = () => {
  
  const formE = document.querySelector('form');
  
  // wasn't sure if I should call this one here or one function above
  const drinkList = document.querySelector('.drink__list');
  
  formE.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userInput = document.getElementById('search-bar');
    const ingredientType = userInput.value;
    
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientType}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`This seems like invalid ingredient. Please try another one`);
      }
    }).then((drink) => {
      const drinkResult = drink.drinks
      
      drinkResult.forEach((drink) => {
        
        const drinkName = drink.strDrink;
        const drinkImg = drink.strDrinkThumb;
        
        const drinkResultList = document.createElement('li');
        
        drinkResultList.innerHTML = `<img src="${drinkImg}" alt="${drinkName}">${drinkName}`;
        
        drinkList.append(drinkResultList);
      });
    }).catch((err) => {
      alert(`This seems like invalid ingredient. Please try another one`);
    })
  })
}

cocktailApp.init();
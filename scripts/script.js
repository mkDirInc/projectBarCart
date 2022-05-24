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

cocktailApp.nxtBtn = document.querySelector('.nxtArrow');
cocktailApp.prevBtn = document.querySelector('.prevArrow');

cocktailApp.init = () => {
  cocktailApp.getIngredientName();
};

cocktailApp.getFetchURL = function() {
  const searchTerm = this.userInput.value;
  console.log(searchTerm);
  const searchTypeChoice = document.querySelector('input[name="search-type"]:checked').value;
  console.log(searchTypeChoice);
  return `${this.endpoint}${this.searchTypes[searchTypeChoice]}${searchTerm}`;
}

// Get user's input and fetch the data from API
cocktailApp.getIngredientName = function() {
  
  cocktailApp.form.addEventListener('submit', (e) => {
    e.preventDefault();

        
    fetch(this.getFetchURL())
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
  this.drinkList.innerHTML = '';
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

  // carousel list
    // call imgResult List in array
  cocktailApp.slideImg = Array.from(cocktailApp.drinkList.children);
    // adding currentPic class on first img result list
  cocktailApp.slideImg[0].classList.add('current__pic');
    // setting initial slideSize
  cocktailApp.slideSize = cocktailApp.slideImg[0].clientWidth;
    // by using forEach(), setting each img size
  cocktailApp.slideImg.forEach((pic, i) => {
    pic.style.left = cocktailApp.slideSize * i +'px';
  });


  // cocktailApp.movePic = (drinkList, currentPic, targetPic) => {
  //   this.drinkList.style.transform = 'translateX(-' + targetPic.style.left + ')';
  //   currentPic.classList.remove('current__pic');
  //   targetPic.classList.add('current__pic');
  // }

  cocktailApp.nxtBtn.addEventListener('click', e => {
    const currentPic = cocktailApp.drinkList.querySelector('.current__pic');
    const nxtPic = currentPic.nextElementSibling;
    const sizeToSlide = nxtPic.style.left;
    cocktailApp.drinkList.style.transform = 'translateX(-' + sizeToSlide + ')';

    currentPic.classList.remove('current__pic');
    nxtPic.classList.add('current__pic');
    
    // cocktailApp.movePic(drinkList, currentPic, nxtPic);
  });

  cocktailApp.prevBtn.addEventListener('click', e => {
    const currentPic = cocktailApp.drinkList.querySelector('.current__pic');
    const nxtPic = currentPic.previousElementSibling;
    const sizeToSlide = nxtPic.style.left;
    cocktailApp.drinkList.style.transform = 'translateX(-' + sizeToSlide + ')';

    currentPic.classList.remove('current__pic');
    nxtPic.classList.add('current__pic');
    
    // cocktailApp.movePic(drinkList, currentPic, nxtPic);
  });


}


cocktailApp.init();
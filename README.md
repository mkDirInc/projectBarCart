# Bar Cart

## About The Project
An app for cocktail lovers to search for cocktail recipes by either name or ingredient.

[Live Link](https://bespoke-medovik-334094.netlify.app/)
[<img width="1665" alt="projectBarCart" src="https://user-images.githubusercontent.com/97327628/183830573-512c899d-c434-44b0-8596-cf024c81e084.png">](https://bespoke-medovik-334094.netlify.app/)

## Built With
- HTML5
- SCSS
- JavaScript
- RESTful APIs

## Features
- Cocktail recipe data retreived from RESTful API, [TheCocktailDB](https://www.thecocktaildb.com/api.php)
- The results of searched cocktail recipes are displayed in carousel of rotating 3D cards
- Random cocktail recipe is provided if nothing is found
- SCSS used to keep styling files organized

## Pseudo-code
1. User chooses whether to search by cocktail name or ingredient and uses the provided search bar.
2. The provided search term is used to fetch data from the Cocktail API
    - User’s search type determines the URL pathname value and search key, while their search term determines the search value.
    - The returned data is used to populate a list of ‘card’ elements. Each card is assigned an attribute and value (‘data-id’, drinkObject.idDrink) that will be used to create a ‘recipe card’ if the user requests it.
    - A local userCocktails object is populated (indexed by idDrink) in the background to store relevant data about each cocktail so that it can be used to populate a ‘recipe card’ on request.
3. Cocktails are displayed as a grid of cards (with click listeners) that feature the drink name and a thumbnail image.
4. Clicking on a card reveals a ‘recipe card’ with the cocktail name, larger image, ingredients, instructions, etc.
    - If the data on that cocktail includes ingredients and instructions, use that data to make the ‘recipe card’
      - If not, an additional fetch call (by id) is made to retrieve the data necessary to populate the ‘recipe card’ (this data is also added to the userCocktails object)

## Acknowledgments
- [Font Awesome](https://fontawesome.com/)

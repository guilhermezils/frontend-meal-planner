const recipesUrl = "http://localhost:3000/recipes"
const pageSize = 5;
let pageOffset = 0;

fetch(`${recipesUrl}/limit=${pageSize}/offset=${pageOffset}`) 
.then(res=>res.json())
.then(displayRecipes);


function displayRecipes(recipes){
    recipes.forEach (recipe => displayRecipe(recipe));
}

function displayRecipe(recipe)
{
    const recipeDiv = document.createElement('span');
    recipeDiv.innerHTML = `
        <h4>${recipe.name}</h4>
        <img src=${recipe.image}>
        `;
    const recipeBar = document.getElementById('recipe-bar');
    recipeBar.append(recipeDiv);
}
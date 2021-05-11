const recipesUrl = "http://localhost:3000/recipes"
const pageSize = 5;
let pageOffset = 0;
const recipeBar = document.getElementById('recipe-bar');
const recipeCard = document.getElementById('recipe-summary-container')//Guilherme


getRecipes();

function getRecipes()//Alexandra 
{
    recipeBar.innerHTML = '';

    fetch(`${recipesUrl}/limit=${pageSize}/offset=${pageOffset}`) 
    .then(res=>res.json())
    .then(displayRecipes);
}

function displayRecipes(recipes){
    recipes.forEach (recipe => displayRecipe(recipe));
    console.log(recipes)//Guilherme wrote this console.log
}

function displayRecipe(recipe)//Alexandra
{
    const recipeDiv = document.createElement('span');
    recipeDiv.innerHTML = `
        <h4>${recipe.name}</h4>
        <img src=${recipe.image}>
        `;
        recipeDiv.addEventListener('click',() => fetchOneRecipe(recipe))
    recipeBar.append(recipeDiv);
}





//Render Details - display 

const recipeBox = document.createElement('recipe-div')






//fetch that one recipe
function fetchOneRecipe(recipe) {
    console.log(recipe)
    return fetch(`${recipesUrl}/${recipe.id}`)
        .then(response => response.json())
        .then(data)
}













//get button element to add page updates to 
document.getElementById('next-page').addEventListener('click', () => updatePage(5))
document.getElementById('previous-page').addEventListener('click', () => updatePage(-5))

function updatePage(value)
{
    pageOffset = pageOffset + value;
    if(pageOffset < 0)
    {
        pageOffset = 0;
    }
    getRecipes();
}
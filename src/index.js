const recipesUrl = "http://localhost:3000/recipes"
const pageSize = 5;
let currentPage = 1;

fetch(`${recipesUrl}/?_page=${currentPage}&_limit=${pageSize}`) 
.then(res=>res.json())
.then(displayRecipes)

function displayRecipes(recipes){
console.log(recipes)
recipes.forEach (recipe => {
    const recipeDiv = document.createElement('span')
    recipeDiv.innerHTML = `${recipe.name}`
    const recipeBar = document.getElementById('recipe-bar')
    recipeBar.append(recipeDiv)
})

}
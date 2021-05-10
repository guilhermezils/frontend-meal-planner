const recipesUrl = "http://localhost:3000/recipes"
const pageSize = 5;
let pageOffset = 0;

<<<<<<< HEAD
fetch(`${recipesUrl}/?_page=${currentPage}&_limit=${pageSize}`)
=======
fetch(`${recipesUrl}/limit=${pageSize}/offset=${pageOffset}`) 
>>>>>>> get-recipes
.then(res=>res.json())
.then(displayRecipes);


function displayRecipes(recipes){
    recipes.forEach (recipe => 
        {
            const recipeDiv = document.createElement('span')
            recipeDiv.innerHTML = `${recipe.name}`
            const recipeBar = document.getElementById('recipe-bar')
            recipeBar.append(recipeDiv)
        })

}
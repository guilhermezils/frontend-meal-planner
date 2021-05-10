const recipesUrl = "http://localhost:3000/recipes"

fetch(recipesUrl) 
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
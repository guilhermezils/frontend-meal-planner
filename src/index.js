const recipesUrl = "http://localhost:3000/recipes";
const mealsUrl = "http://localhost:3000/meals";
const pageSize = 5;
let pageOffset = 0;
const recipeBar = document.getElementById('recipe-bar');

getRecipes();

function getRecipes() 
{
    recipeBar.innerHTML = '';

    fetch(`${recipesUrl}/limit=${pageSize}/offset=${pageOffset}`) 
    .then(res=>res.json())
    .then(displayRecipes);
}

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
    recipeBar.append(recipeDiv);
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

//add meal plan functionality/feature
const weeklyMealsButton = document.getElementById('weekly-meals-btn')
weeklyMealsButton.addEventListener('click', toggleWeeklyMealsView);

const mealPlanDiv = document.getElementById('meal-plan');

function toggleWeeklyMealsView(event)
{
    //change text on button
    weeklyMealsButton.innerHTML = weeklyMealsButton.innerHTML == 'Hide Weekly Meals' ? 'Weekly Meals' : 'Hide Weekly Meals';
    //get div
    mealPlanDiv.style = mealPlanDiv.style == 'display:show' ? 'display:none' : 'display:show';
    console.log(mealPlanDiv.style);
    //grab meals from database
    fetch(mealsUrl)
    .then(res=>res.json())
    .then(addMealsToTable);
}

function addMealsToTable(meals)
{
    // meals.sort
    mealPlanDiv.innerHTML = '';
    mealPlanDiv.innerHTML = `<h4>Weekly Meals</h4>`;
    meals.forEach(meal => addMeal(meal));
}

function addMeal(meal)
{
    const mealPlanCard = document.createElement('span');
    mealPlanCard.innerHTML = `
        <h4>${meal.date}</h4>
        <p>${meal.typeOfMeal}</p>
        <p>${meal.recipe_id}</p>
    `
    mealPlanDiv.appendChild(mealPlanCard);
}



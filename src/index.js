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
const mealCards = document.getElementById('meal-cards');

function toggleWeeklyMealsView(event)
{
    //change text on button
    weeklyMealsButton.innerHTML = weeklyMealsButton.innerHTML == 'Hide Weekly Meals' ? 'Weekly Meals' : 'Hide Weekly Meals';
    //get div
    mealPlanDiv.style.display = mealPlanDiv.style.display == 'flex' ? 'none' : 'flex';
    //grab meals from database
    fetch(mealsUrl)
    .then(res=>res.json())
    .then(displayPlannedMeals);
}

function displayPlannedMeals(meals)
{
    // meals.sort
    mealCards.innerHTML = '';
    meals.forEach(meal => displayMeal(meal));
}

function displayMeal(meal)
{
    let recipeName = '';    
    const mealPlanCard = document.createElement('span');
    fetch(`${recipesUrl}/${meal.recipe_id}`)
    .then(res=>res.json())
    .then(recipe => {
        recipeName = recipe.name;
        mealPlanCard.innerHTML = `
            <strong>${meal.date}</strong>
            <p>${recipeName}</p>
            <p>${meal.typeOfMeal}</p>
            <button>Edit Meal </button>`
        // addEditFunctionalityToButton();
    });

    mealPlanCard.classList.add('meal-card')
    mealCards.appendChild(mealPlanCard);
}

function editMeal(event)
{  
    console.log(event);
}



const recipesUrl = "http://localhost:3000/recipes";
const mealsUrl = "http://localhost:3000/meals";
const pageSize = 5;
let pageOffset = 0;
const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json' 
}
const recipeBar = document.getElementById('recipe-bar');
const recipeCard = document.getElementById('recipe-summary-container')//Guilherme
const recipeBox = document.createElement('recipe-div')

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
}

function displayRecipe(recipe)//Alexandra
{
    const recipeDiv = document.createElement('span');
    recipeDiv.innerHTML = `
        <h4>${recipe.name}</h4>
        <img src=${recipe.image}>
        `;
    recipeDiv.addEventListener('click',() => fetchOneRecipe(recipe))
    recipeDiv.addEventListener('click',() => fetchRecipeIngredients(recipe)) //Guilherme
    recipeBar.append(recipeDiv);
}

//Render Details - display //Guilherme
function displayMealCard(recipe){
    recipeBox.innerHTML = `
    <span><div>${recipe.instructions}</div>
    <img src=${recipe.image}></span>
    <br><button>DELETE</button>
    <br><button>Add to Planner </button>
    `;
    recipeCard.append(recipeBox)
    
}
// Diplay list of ingredients //Guilherme
function displayRecipeIngredients(ingredients){
    ingredients.forEach(obj => {
        const li = document.createElement('li')
            li.textContent = obj.name
            recipeBox.append(li)
    })
}

//fetch that one recipe //Guilherme
function fetchOneRecipe(recipe) {
    recipeBox.innerHTML.reset
    return fetch(`${recipesUrl}/${recipe.id}`)
        .then(response => response.json())
        .then(displayMealCard)
}
//Fetch the ingredients from that recipe // Guilherme
function fetchRecipeIngredients(recipe){
    return fetch(`${recipesUrl}/${recipe.id}/ingredients`)
        .then(response => response.json())
        .then(displayRecipeIngredients)
}




//get button element to add page updates to //Alexandra
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

//add meal plan functionality/feature //Alexandra
const weeklyMealsButton = document.getElementById('weekly-meals-btn')
weeklyMealsButton.addEventListener('click', toggleWeeklyMealsView);

const weeklyMealPlanner = document.getElementById('weekly-meal-planner');
const mealPlanDiv = document.getElementById('meal-plan');
const mealCards = document.getElementById('meal-cards');

function toggleWeeklyMealsView(event)
{
    //change text on button
    weeklyMealsButton.innerHTML = weeklyMealsButton.innerHTML == 'Hide Weekly Meals' ? 'Weekly Meals' : 'Hide Weekly Meals';
    //get div
    weeklyMealPlanner.style.display = weeklyMealPlanner.style.display == 'block' ? 'none' : 'block';

    //grab meals from database
    getMeals();
}

function getMeals()
{
    fetch(mealsUrl)
    .then(res => res.json())
    .then(displayPlannedMeals);
}

function displayPlannedMeals(meals)//Alexandra
{
    // meals.sort
    mealCards.innerHTML.reset;
    meals.forEach(meal => displayMeal(meal));
}

function displayMeal(meal)//Alexandra
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
            <button id = 'edit'>Edit Meal </button>
            <button id = 'delete'>Remove</button>
        `
        mealPlanCard.querySelector('#edit').addEventListener('click', () => editMeal(meal, recipeName))
        mealPlanCard.querySelector('#delete').addEventListener('click', () => deleteMeal(meal))
    });

    mealPlanCard.classList.add('meal-card')
    mealCards.appendChild(mealPlanCard);
}

function deleteMeal(meal)
{
    const mealUrl = `${mealsUrl}/${meal.id}`;
    
    fetch(mealUrl, {
        method: 'DELETE',
        headers
    })
    .then(getMeals);
}

const editMealsForm = document.getElementById('edit-meal');

function editMeal(meal, recipeName)
{  
    //fill in form with meal data
    editMealsForm.name.value = recipeName;
    editMealsForm.date.value = meal.date;
    editMealsForm['meal-id'].value = meal.id;
}

editMealsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // console.log(event.target);
    const date = event.target.date.value;
    const typeOfMeal = event.target['type-of-meal'].value;
    const mealId = event.target['meal-id'].value;

    const updatedMeal = {
        date,
        typeOfMeal
    }
    const mealUrl = `${mealsUrl}/${mealId}`;
    fetch(mealUrl, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updatedMeal)
    })
    .then(res => res.json())
    .then((meal) => {
        console.log(meal);
        getMeals();
    })
});



//make a fetch request to recipe ingredients
//using the recipe id
//get request to recipeingredients#index
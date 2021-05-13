const recipesUrl = "http://localhost:3000/recipes";
const mealsUrl = "http://localhost:3000/meals";
const pageSize = 5;
let pageOffset = 0;
const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json' 
}
const recipeBar = document.getElementById('recipe-bar');
const recipeCard = document.getElementById('recipe-summary-container')
const recipeBox = document.createElement('div')

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
    recipeDiv.addEventListener('click',() => fetchOneRecipe(recipe))
    recipeBar.append(recipeDiv);
}

//Render Details - display 
function displayMealCard(recipe){
    document.getElementById('meal-info').innerHTML = '';
    recipeBox.innerHTML = `
        <div id= 'recipe-instructions'>${recipe.instructions}</div>
        <img src = ${recipe.image}>
        `;
    //get and render ingredients
    fetchRecipeIngredients(recipe, displayRecipeIngredients);

    //image 
    // const recipeImg = document.createElement('img');
    // recipeImg.src = recipe.image;
    // recipeBox.appendChild(recipeImg);

    //add id for css
    recipeBox.id = 'recipe-box'
    recipeCard.append(recipeBox)
}

// Diplay list of ingredients //
function displayRecipeIngredients(ingredients){
    const ul = document.createElement('ul');
    ingredients.forEach(obj => {
        const li = document.createElement('li');
        li.textContent = obj.name;
        ul.appendChild(li);
    });
    recipeBox.append(ul);
}

//fetch that one recipe //
function fetchOneRecipe(recipe) {
    recipeBox.innerHTML.reset
    return fetch(`${recipesUrl}/${recipe.id}`)
        .then(response => response.json())
        .then(displayMealCard)
}
//Fetch the ingredients from that recipe // 
function fetchRecipeIngredients(recipe, inputFunction){
    return fetch(`${recipesUrl}/${recipe.id}/ingredients`)
        .then(response => response.json())
        .then(inputFunction)
}

//get button element to add page updates to //
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

//add meal plan functionality/feature //
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
    getMeals(displayPlannedMeals);
}
//add event listener to grocery button
document.getElementById('grocery-list-btn').addEventListener('click', (event) => {
    toggleGroceryListView(event);
    //send fetch to get all meals from table
    getMeals(getListOfIngredients);
});

const groceryListDiv = document.getElementById('grocery-list');

function toggleGroceryListView(event)
{    //change text on button
    event.target.innerHTML = event.target.innerHTML == 'Hide Grocery List' ? 'Grocery List' : 'Hide Grocery List';
    //get div
    groceryListDiv.style.display = groceryListDiv.style.display == 'block' ? 'none' : 'block';
}

function getListOfIngredients(meals)
{
    groceryListDiv.innerHTML = '';
    const groceryList = document.createElement('ul');
    groceryList.innerHTML = '<h4><i>Grocery List</i></h4>';
    //get ingredients for all those meals
    meals.forEach(meal => {
        const recipeId = meal.recipe_id;
        console.log(recipeId);
        const groceryItem = document.createElement('li');
        groceryItem.innerHTML = `${recipeId}`;
        groceryList.appendChild(groceryItem);
    })
    groceryListDiv.appendChild(groceryList);
    //list out each ingredient for those meals
    // console.log(meals);
}

function getMeals(functionToCall)
{
    fetch(mealsUrl)
    .then(res => res.json())
    .then(functionToCall);
}

function displayPlannedMeals(meals)
{
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
    .then(() => getMeals(displayPlannedMeals));
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
        getMeals(displayPlannedMeals);
    })
});

//1- Link to get a random meal
let randomMealURL = 'https://www.themealdb.com/api/json/v1/1/random.php';

//2- Link to lookup a specific meal with an id
//https://www.themealdb.com/api/json/v1/1/lookup.php?i=

//3- Link to search for meals using a keyword
//https://www.themealdb.com/api/json/v1/1/search.php?s=

const getRandomMeal = ()=> {
 const resp = fetch(randomMealURL);
 resp.then((item)=> {
  let cleanedItem = item.json();
  return cleanedItem;
 }).then((data)=>console.log(data))
};

const mealsElement = document.getElementById(meals);
const favourites = document.querySelector(favouriteMeal)
getRandomMeal();
async function getRandomMeal(){
    const resp = fetch 
    ('https://www.themealdb.com/api/json/v1/1/random.php');
    
    const randomData = (await resp).json();
    
    const randomMeal = randomData.meals[0];
    console.log(randomMeal);

    mealsElement.innerHTML = "";
    addMeal(randomMeal);
}

function addMeal(mealData)
{
    const meal = document.childElement("div");
    meal.classList.add("meal");
    meal.innerHTML = `<div class="meal-header">
                        <span class="random">Meal of the Day</span>
                        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                </div>
                <div class="meal-body">
                    <h3>${mealData.strMeal}</h3>
                    <button class="fav-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>` 

    
    let favouriteButton = meal.querySelector(".fav-btn");
    favouriteButton.addEventListener("click",()=>{
       if(favouriteButton.classList.contains('active'))
    {
        favouriteButton.classList.remove('active');
        removeMealFromLocalStorage(mealData.idMeal); 

    }
    else
    {
       favouriteButton.classList.add('active');
       adMealToLocalStorage(mealData.idMeal);  
    }
    })

    
    mealsElement.appendChild(meal);

    updateFavouriteMeals();

}

function addMealToLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealId',JSON.stringify([...mealIds,mealId]));

}  

function removeMealFromLocalStorage(mealId)
{
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealIds',JSON.stringify(
        mealIds.filter(id => id!=mealId)
    ))
}  

function getMealsFromLocalStorage()
{
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null?[] : mealIds;

}

const updateFavouriteMeals = () =>{
  //favourites.innerHTML\
  const mealIds = getMealsFromLocalStorage();
  console.log(mealIds);

  let meals = [];

  mealIds.forEach(async (meal) => {
    let tmpMeal = await getMealById(meal);
    //meals.push(tmpMeal);

    addMealtoFavourites(tmpMeal);
  })
}

const getMealById = async (id) => {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const mealId = (await resp).json();
    
    const output = data.meals[0];
    console.log(output);

    return output;

    

}

const addMealtoFavourites = (meal)=> {
    const favouriteMeal = document.createElement('li');
    favouriteMeal.innerHTML = ` <img id="fav-img">
                
                 src ="${meal.strMealThumb}"
                 alt ="${meal.strMeal}">
                <span>${meal.strMeal}</span>
                <button class = "clear">
                <i class="fas fa-window-close"></i>
                </button>`;
    const clearButton = favouriteMeal.querySelector('.clear');
    clearButton.addEventListener('click', ()=>{
        removeMealFromLocalStorage(meal.idMeal);
        updateFavouriteMeals();
    })
    favourites.appendChild(favouriteMeal);
    
    `
}
getRandomMeal();
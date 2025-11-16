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
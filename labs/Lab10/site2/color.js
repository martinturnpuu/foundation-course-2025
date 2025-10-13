const colors = ["green", "red", "rgba(133,122,200)", "#f15025"];

const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");
const colorText = document.querySelector('#colorCode');
const colorPanel = document.querySelector('#colorPanel');



function randomColor()
{
    console.log('First button got clicked!!!');
    let colorIndex = Math.floor(Math.random()*colors.lenght);
    console.log(colorIndex);
    colorPanel.style.backgroundColor = colors[colorIndex];
    colorText.innerText =  colors[colorIndex];

}

btn1.addEventListener('click',randomColor);
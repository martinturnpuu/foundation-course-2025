const colors = ["#dfe22fff", "#253b9dff", "#259d81ff", "#f15025",
"rgba(100,22,33,0.8)","rgba(0, 0, 0, 0.8)","rgba(218, 199, 35, 0.8)"

];
const rgba = ["rgba(100,22,33,0.8)","rgba(0, 0, 0, 0.8)","rgba(218, 199, 35, 0.8)"];
const hex = ["#ffc1b1","#c44121ff","#57c421ff","#2621c4ff"];



const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const btn3 = document.querySelector(".btn3");

const colorText = document.querySelector('#colorCode');
const colorPanel = document.querySelector('#colorPanel');


function randomColor()
{
    console.log('First button got clicked!!!');
    let colorIndex = Math.floor(Math.random()*colors.length);
    console.log(colorIndex);
    colorPanel.style.backgroundColor = colors[colorIndex];
    colorText.innerText =  colors[colorIndex];

}

btn1.addEventListener('click',randomColor);
//use this format to change the color rgba
//rgba(r,g,b) 0 


function randomRgba()
{
    console.log('Second button got clicked!!!');
    let colorIndex = Math.floor(Math.random()*rgba.length);
    console.log(colorIndex);
    colorPanel.style.backgroundColor = rgba[colorIndex];
    colorText.innerText =  rgba[colorIndex];

}

btn2.addEventListener('click',randomRgba);
//use this format to change the color rgba
//rgba(r,g,b) 0 


function randomHex()
{
    console.log('Third button got clicked!!!');
    let colorIndex = Math.floor(Math.random()*hex.length);
    console.log(colorIndex);
    colorPanel.style.backgroundColor = hex[colorIndex];
    colorText.innerText =  hex[colorIndex];

}

btn3.addEventListener('click',randomHex);
//use this format to change the color rgba
//rgba(r,g,b) 0 
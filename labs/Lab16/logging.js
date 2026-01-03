import { signup } from "./auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const messageDiv = document.getElementById("email");


const showMessage = (msg, isError=false) =>{
    messageDiv.textContent = msg;
    messageDiv.style.color = isError? 'red': 'green';
}

signupBtn.addEventListener("click", (e)=>{
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
       // console.log("Sign up Cliked!",email,password)
       try {

        const user = signup(email,password);
        showMessage("Sign up.Welcome",user.email);
        setTimeout(()=> {
            window.location.ref = "app.html"
        },1000)
}
catch{
    showMessage(error.messag,true);
}
        
})


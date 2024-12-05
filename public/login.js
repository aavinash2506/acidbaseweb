const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginContainer = document.getElementById("loginContainer");
const signupContainer = document.getElementById("signupContainer");

loginBtn.addEventListener("click", () => {
    loginContainer.style.display = "block";       
    signupContainer.style.display = "none";       
    loginBtn.classList.add("active");             
    signupBtn.classList.remove("active");
});

signupBtn.addEventListener("click", () => {
    signupContainer.style.display = "block";      
    loginContainer.style.display = "none";        
    signupBtn.classList.add("active");            
    loginBtn.classList.remove("active");
});

document.getElementById("loginForm").addEventListener("submit",async function(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    console.log("Login Details:", { email, password });
    try {
        const login = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        }).then((res) => res.json());
    
        console.log(login);
    
        if (login.message && login.token) {
            localStorage.setItem('token', login.token);
            console.log("Login success");
            alert("Login successful!");
            window.location.href = "questions.html";
        } else {
            console.log("Login failed");
            alert(login.error || "Login failed");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Network error or server unavailable");
    }
});

document.getElementById("signupForm").addEventListener("submit",async function(e) {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const firstName = document.getElementById("signupFirstName").value;
    const lastName = document.getElementById("signupLastName").value;
    const setPassword = document.getElementById("setPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (setPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    console.log("Sign Up Details:", { email, firstName, lastName, password: setPassword });
    const register = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, firstName, lastName, password: setPassword}),
    }).then((res) => res.json())

    console.log(register);
    if(register.message && register.userId){
        console.log(register.userId);
        alert("Register success" );
        window.location.href = "index.html";
    } else {
        console.log("register Failed");
        alert(register.response);
    }
});

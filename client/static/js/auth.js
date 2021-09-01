async function requestLogin(e) {
  e.preventDefault();
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value
      })
    };
    console.log(e.target.email.value);
    const r = await fetch(`http:localhost:3000/auth/login`, options);
    const data = await r.json();
    console.log("data", data);
    if (!data.success) {
      throw new Error("Login not authorised");
    }
    login(data.token);
  } catch (err) {
    console.warn(err);
  }
}

async function requestRegistration(e) {
  e.preventDefault();
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
    };
    const r = await fetch(`http://localhost:3000/auth/register`, options);
    const data = await r.json();
    if (data.err) {
      throw Error(data.err);
    }
    requestLogin(e);
  } catch (err) {
    console.warn(err);
  }
}

function login(token) {
  const user = jwt_decode(token);
  localStorage.setItem("token", token);
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
  localStorage.setItem("id", user.id);
  window.location.href = "http://127.0.0.1:5503/client/dash.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "http://127.0.0.1:5503/client/index.html";
}

const loginForm = document.querySelector("form#login");
console.log(loginForm);
loginForm.addEventListener("submit", requestLogin);

// const registrationForm = document.querySelector("form#register");
// console.log(registrationForm);
// registrationForm.addEventListener("submit", requestRegistration);

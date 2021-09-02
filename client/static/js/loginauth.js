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
    const r = await fetch(
      `https://get-your-sht-together.herokuapp.com/auth/login`,
      options
    );
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

function login(token) {
  const user = jwt_decode(token);
  localStorage.setItem("token", token);
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
  localStorage.setItem("id", user.id);
  window.location.href = "https://gyst.vercel.app/dash.html";
}

const loginForm = document.querySelector("form#login");
loginForm.addEventListener("submit", requestLogin);

module.exports = { requestLogin };

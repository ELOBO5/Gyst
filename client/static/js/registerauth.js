async function requestRegistration(e) {
  e.preventDefault();
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value
      })
    };
    console.log(e.target.username.value);
    console.log(e.target.email.value);
    console.log(e.target.password.value);
    const r = await fetch(
      `https://get-your-sht-together.herokuapp.com/auth/register`,
      options
    );
    const data = await r.json();
    if (data.err) {
      throw Error(data.err);
      return;
    }
    window.location.href = "https://gyst.vercel.app/client/index.html";
  } catch (err) {
    console.warn(err);
  }
}

const registrationForm = document.querySelector("form#register");
registrationForm.addEventListener("submit", requestRegistration);

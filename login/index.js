async function validateTokenAndRedirect() {
  try {
    const renewToken = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
      credentials: "include",
      method: "POST",
    });
    if (!renewToken.ok) return;
  } catch (err) {}
  window.location.replace('../account/');
}

validateTokenAndRedirect();

async function login() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const response = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token/" + username.value, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ password: password.value }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (response.ok) {
    localStorage.setItem("username", username.value.charAt(0).toUpperCase() + username.value.slice(1));

    window.location.replace('../account/');
  } else {
    const errorMessage = document.getElementById("login-error");

    errorMessage.style.display = "block";

    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }
}

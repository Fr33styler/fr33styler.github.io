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

  console.log(response.status);
  if (response.ok) {
    console.log("Login successful! " + await response.text());
    window.location.replace('../account/');
  } else {
    console.log("Invalid login!");
  }
}

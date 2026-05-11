async function login() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  try {
    const response = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token/" + username.value, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ password: password.value }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Login successful! " + await response.json());
      window.location.replace('../account/');
    } else {
      console.log("Invalid login!");
    }
  } catch (error) {
    console.log(error.message);
  }
}

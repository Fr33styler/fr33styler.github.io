async function validateTokenOrRedirect() {
  const renewToken = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
    credentials: "include",
    method: "POST",
  });
  if (!renewToken.ok) {
    window.location.replace('../login');
  }
}

validateTokenOrRedirect();

document.addEventListener("DOMContentLoaded", async () => {
  
  const usernameResponse = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/username", {
    credentials: "include",
    method: "GET",
  });

  if (usernameResponse.ok) {
    const title = document.getElementById("title");
    title.textContent = title.textContent.replace("Stranger", await usernameResponse.text());
  }
});

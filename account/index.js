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

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (username == null) return;

  const title = document.getElementById("title");
  title.textContent = title.textContent.replace("Stranger", username);
});

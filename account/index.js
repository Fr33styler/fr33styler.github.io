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

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');
    if (key === name) return value;
  }
  return "Stranger";
}

const title = document.getElementById("title");
title.textContent = title.textContent.replace("Stranger", getCookie("username"));


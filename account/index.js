async function checkToken() {
  const renewToken = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
    credentials: "include",
    method: "POST",
  });

  return renewToken.ok;
}

if (!checkToken()) {
  window.location.replace('../login');
}

async function validateTokenOrRedirect() {
  try {
    const renewToken = await fetch("https://cdn.fr33styler.ro:8443/auth/accounts/token", {
      credentials: "include",
      method: "POST",
    });
    if (!renewToken.ok) {
      window.location.replace('../login');
    }
  } catch (e) {
    window.location.replace('../login');
  }
}

validateTokenOrRedirect();

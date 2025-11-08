// modules/auth-manager.js - Manejo de autenticación
import Auth from "../auth.js";

const AuthManager = (() => {
  const init = () => {
    const user = Auth.getCurrentUser();

    if (user) {
      showAuthenticatedUI(user);
    } else {
      Auth.requireAuth();
    }
  };

  const showAuthenticatedUI = (username) => {
    document.getElementById(
      "welcome-message"
    ).textContent = `Bienvenido, ${username}`;
    document.getElementById("reports-content").classList.remove("d-none");
  };

  const handleLogout = () => {
    Auth.logout();
    window.location.href = "login.html";
  };

  return {
    init,
    handleLogout,
  };
})();
// Al final del archivo, cambia:
export { AuthManager }; // En lugar de export default

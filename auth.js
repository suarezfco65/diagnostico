// auth.js

const VALID_USERS = {
  admin: "siscomres2024", // Usuario de ejemplo
  reporte: "clave123", // Otro usuario de ejemplo
};

const USER_SESSION_KEY = "siscomres_current_user";

const AuthModule = (() => {
  /**
   * Intenta autenticar a un usuario.
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña.
   * @returns {boolean} True si la autenticación es exitosa.
   */
  const login = (username, password) => {
    if (VALID_USERS[username] === password) {
      // Guardar la sesión en localStorage (solo para simulación)
      localStorage.setItem(USER_SESSION_KEY, username);
      return true;
    }
    return false;
  };

  /**
   * Cierra la sesión activa.
   */
  const logout = () => {
    localStorage.removeItem(USER_SESSION_KEY);
  };

  /**
   * Verifica si existe una sesión activa.
   * @returns {string|null} El nombre de usuario si hay sesión, o null.
   */
  const getCurrentUser = () => {
    return localStorage.getItem(USER_SESSION_KEY);
  };

  /**
   * Protege una página, redirigiendo al login si no hay sesión.
   * @param {string} loginPageUrl - URL de la página de login (ej: index.html).
   */
  const requireAuth = (loginPageUrl = "index.html") => {
    if (!getCurrentUser()) {
      window.location.href = loginPageUrl;
    }
  };

  return {
    login,
    logout,
    getCurrentUser,
    requireAuth,
  };
})();

export default AuthModule;

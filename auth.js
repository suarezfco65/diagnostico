// auth.js

const VALID_USERS = {
  // USUARIOS DE GESTIÓN (Tienen acceso a reportes, diseñador, etc.)
  admin: { password: "siscomres2024", role: "ADMIN" },
  reporte: { password: "clave123", role: "REPORTE" },

  // NUEVOS USUARIOS DE REGISTRO (Solo acceso a index.html)
  brigadista1: { password: "briga123", role: "BRIGADISTA" },
  brigadista2: { password: "briga456", role: "BRIGADISTA" },
};

const USER_SESSION_KEY = "siscomres_current_user";
const ROLE_SESSION_KEY = "siscomres_current_role"; // NUEVA CLAVE PARA GUARDAR EL ROL

const AuthModule = (() => {
  /**
   * Intenta autenticar a un usuario y guarda el rol en la sesión.
   */
  const login = (username, password) => {
    const userDetails = VALID_USERS[username];

    if (userDetails && userDetails.password === password) {
      // Guardar la sesión y el ROL
      localStorage.setItem(USER_SESSION_KEY, username);
      localStorage.setItem(ROLE_SESSION_KEY, userDetails.role); // GUARDAR ROL
      return true;
    }
    return false;
  };

  /**
   * Cierra la sesión activa.
   */
  const logout = () => {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(ROLE_SESSION_KEY); // Limpiar el rol
  };

  /**
   * Verifica si existe una sesión activa.
   * @returns {string|null} El nombre de usuario si hay sesión, o null.
   */
  const getCurrentUser = () => {
    return localStorage.getItem(USER_SESSION_KEY);
  };

  /**
   * Obtiene el rol del usuario logueado.
   * @returns {string|null} El rol del usuario o null.
   */
  const getCurrentRole = () => {
    return localStorage.getItem(ROLE_SESSION_KEY);
  };

  /**
   * Verifica si el usuario logueado tiene el rol especificado.
   * @param {string} role - El rol a verificar (ej: "BRIGADISTA").
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return getCurrentRole() === role;
  };

  /**
   * Protege una página, redirigiendo al login si no hay sesión.
   * NOTA: El valor por defecto ahora es 'login.html'
   */
  const requireAuth = (loginPageUrl = "login.html") => { // <-- CAMBIO AQUÍ
      if (!getCurrentUser()) {
        window.location.href = loginPageUrl;
      }
  };

  return {
    login,
    logout,
    getCurrentUser,
    getCurrentRole, // Exportar nueva función
    hasRole, // Exportar nueva función
    requireAuth,
  };
})();

export default AuthModule;

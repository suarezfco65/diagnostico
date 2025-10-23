// login.js

import Auth from './auth.js';
import * as Storage from './storage.js';

const LoginModule = (() => {
    
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const alertContainer = document.getElementById('login-alert-container');

    const handleLogin = (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Limpiar alertas anteriores
        alertContainer.innerHTML = '';

        if (Auth.login(username, password)) {
            // Éxito: Redirigir a la página principal (índice)
            window.location.href = 'index.html'; 
        } else {
            // Fallo: Mostrar alerta
            const alertHtml = `<div class="alert alert-danger" role="alert">Usuario o contraseña incorrectos.</div>`;
            alertContainer.innerHTML = alertHtml;
            passwordInput.value = ''; // Limpiar campo de contraseña
        }
    };

    const init = () => {
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        
        // Si el usuario ya está logueado, redirigir inmediatamente a index.html
        if (Auth.getCurrentUser()) {
             window.location.href = 'index.html'; 
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', LoginModule.init);
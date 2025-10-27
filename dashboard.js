// dashboard.js

import Auth from "./auth.js";
import * as Storage from "./storage.js";
import * as IndicatorStorage from "./indicator_storage.js"; // Necesitas crear este módulo utilitario

const DASHBOARD_STORAGE_KEY = "siscomres_user_dashboards";
let CURRENT_USER = null;

const DashboardModule = (() => {
  // Elementos DOM
  const dashboardContent = document.getElementById("dashboard-content");
  const welcomeMessage = document.getElementById("welcome-message");
  const logoutBtn = document.getElementById("logout-btn");
  const dashboardSelect = document.getElementById("dashboard-select");
  const currentDashboardTitle = document.getElementById(
    "current-dashboard-title"
  );
  const dashboardGrid = document.getElementById("dashboard-grid");
  const createNewBtn = document.getElementById("create-new-btn");
  const modifyBtn = document.getElementById("modify-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const dashboardEditorForm = document.getElementById("dashboard-editor-form");

  // =============================
  // GESTIÓN DE ALMACENAMIENTO (Puntos 2, 4, 5)
  // =============================

  const getDashboardsData = () => {
    const data = Storage.getStorage(DASHBOARD_STORAGE_KEY) || {};
    return data;
  };

  const saveDashboardsData = (data) => {
    Storage.saveStorage(data, DASHBOARD_STORAGE_KEY);
  };

  const getUserDashboards = () => {
    const data = getDashboardsData();
    return data[CURRENT_USER] || { lastDashboardId: null, dashboards: {} };
  };

  const saveUserDashboards = (userData) => {
    const allData = getDashboardsData();
    allData[CURRENT_USER] = userData;
    saveDashboardsData(allData);
  };

  // =============================
  // RENDERIZADO Y CONTROL (Puntos 5, 6)
  // =============================

  /**
   * Carga el panel activo del usuario (último panel trabajado).
   */
  const loadCurrentDashboard = (dashboardId = null) => {
    const userData = getUserDashboards();
    const dashboards = userData.dashboards;
    let targetId = dashboardId || userData.lastDashboardId;

    // Si no hay ID, toma el primero disponible
    if (!targetId && Object.keys(dashboards).length > 0) {
      targetId = Object.keys(dashboards)[0];
    }

    if (!targetId || !dashboards[targetId]) {
      // No hay paneles registrados
      currentDashboardTitle.textContent = "Sin Paneles Registrados";
      dashboardGrid.innerHTML =
        '<div class="alert alert-info">Cree un nuevo panel para empezar.</div>';
      modifyBtn.disabled = true;
      deleteBtn.disabled = true;
      return;
    }

    const dashboard = dashboards[targetId];
    currentDashboardTitle.textContent = dashboard.nombre;

    // Renderizar indicadores
    renderDashboard(dashboard);

    // Actualizar el último ID trabajado y el select
    userData.lastDashboardId = targetId;
    saveUserDashboards(userData);
    dashboardSelect.value = targetId;

    // Habilitar botones de gestión
    modifyBtn.disabled = false;
    deleteBtn.disabled = false;
  };

  /**
   * Dibuja los gráficos en el dashboard. (Lógica dummy por ahora)
   */
  const renderDashboard = (dashboard) => {
    dashboardGrid.innerHTML = "";
    dashboard.indicadores.forEach((item) => {
      const chartDiv = document.createElement("div");
      chartDiv.className = `${item.tamano} mb-4`;
      chartDiv.id = `chart-${item.idIndicador}-${item.orden}`;

      // Título dummy
      chartDiv.innerHTML = `<div class="card p-3"><h6 class="text-primary">${item.idIndicador}</h6><p>Gráfico pendiente de implementación Highcharts.</p></div>`;

      dashboardGrid.appendChild(chartDiv);

      // **AQUÍ IRÍA LA LÓGICA REAL DE Highcharts:**
      // IndicatorStorage.getIndicatorDefinition(item.idIndicador);
      // Highcharts.chart(chartDiv.id, config_generada);
    });
  };

  /**
   * Rellena el select con los paneles del usuario.
   */
  const renderDashboardSelect = () => {
    const { dashboards } = getUserDashboards();
    let html = "";
    Object.entries(dashboards).forEach(([id, panel]) => {
      html += `<option value="${id}">${panel.nombre}</option>`;
    });
    dashboardSelect.innerHTML = html;
  };

  // =============================
  // GESTIÓN DE PANELES (Punto 7)
  // =============================

  const handleDashboardSelectChange = () => {
    loadCurrentDashboard(dashboardSelect.value);
  };

  const handleDeleteDashboard = () => {
    const currentId = dashboardSelect.value;
    if (
      !currentId ||
      !confirm(
        `¿Está seguro de eliminar el panel "${currentDashboardTitle.textContent}"?`
      )
    )
      return;

    const userData = getUserDashboards();
    delete userData.dashboards[currentId];
    userData.lastDashboardId = null; // Forzar a cargar otro panel o ninguno
    saveUserDashboards(userData);

    Storage.showAlert(
      `Panel eliminado correctamente.`,
      "alert-success",
      "dashboard-alert-container"
    );
    initDashboard(); // Recargar la interfaz
  };

  const handleSaveDashboard = (e) => {
    e.preventDefault();

    const name = document.getElementById("edit-dashboard-name").value.trim();
    const isCreating = !document.getElementById("edit-dashboard-id").value;
    const currentId =
      document.getElementById("edit-dashboard-id").value || "dsh_" + Date.now();

    // Lógica de recolección de indicadores seleccionados
    const indicators = Array.from(
      document.querySelectorAll("#available-indicators-list input:checked")
    ).map((input, index) => {
      // Se debe implementar una interfaz más compleja para tamano y orden
      return {
        idIndicador: input.value,
        orden: index + 1,
        tamano: "col-md-6", // Default simple
      };
    });

    if (indicators.length === 0) {
      Storage.showAlert(
        "Debe seleccionar al menos un indicador.",
        "alert-warning",
        "dashboard-alert-container"
      );
      return;
    }

    const newDashboard = {
      id: currentId,
      nombre: name,
      fechaModificacion: new Date().toISOString(),
      indicadores: indicators,
    };

    const userData = getUserDashboards();
    userData.dashboards[currentId] = newDashboard;
    saveUserDashboards(userData);

    Storage.showAlert(
      `Panel "${name}" guardado exitosamente.`,
      "alert-success",
      "dashboard-alert-container"
    );
    initDashboard(); // Recargar la interfaz con el nuevo panel

    // Cerrar el modal (se requiere la inicialización de Bootstrap JS)
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("dashboardModal")
    );
    if (modal) modal.hide();
  };

  // =============================
  // INICIALIZACIÓN
  // =============================

  const initDashboard = () => {
    renderDashboardSelect();
    loadCurrentDashboard();
  };

  const init = () => {
    // 1. Autenticación (Punto 1)
    CURRENT_USER = Auth.getCurrentUser();
    Auth.requireAuth(); // Redirigir al login si no hay sesión

    welcomeMessage.textContent = `Bienvenido, ${CURRENT_USER}`;
    dashboardContent.classList.remove("d-none");

    // 2. Cargar indicadores disponibles en el Modal
    IndicatorStorage.renderAndCheckIndicators(
      document.getElementById("available-indicators-list")
    ); // Utilidad necesaria

    // 3. Inicializar el Dashboard
    initDashboard();

    // 4. Listeners
    if (logoutBtn) logoutBtn.addEventListener("click", Auth.logout);
    if (dashboardSelect)
      dashboardSelect.addEventListener("change", handleDashboardSelectChange);
    if (deleteBtn) deleteBtn.addEventListener("click", handleDeleteDashboard);
    if (dashboardEditorForm)
      dashboardEditorForm.addEventListener("submit", handleSaveDashboard);

    // Configuración de botones de Modal (Crear vs Modificar)
    createNewBtn.addEventListener("click", () => {
      document.getElementById("dashboardModalLabel").textContent =
        "Crear Nuevo Panel";
      dashboardEditorForm.reset();
      document.getElementById("edit-dashboard-id").value = "";
    });

    modifyBtn.addEventListener("click", () => {
      // Lógica para precargar datos en el modal antes de mostrarlo
      document.getElementById("dashboardModalLabel").textContent =
        "Modificar Panel";
      const currentId = dashboardSelect.value;
      const dashboard = getUserDashboards().dashboards[currentId];

      document.getElementById("edit-dashboard-name").value = dashboard.nombre;
      document.getElementById("edit-dashboard-id").value = currentId;

      // Lógica: Marcar los checkboxes de los indicadores que ya están en el panel
      IndicatorStorage.checkSelectedIndicators(dashboard.indicadores);
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", DashboardModule.init);

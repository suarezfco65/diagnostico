document.addEventListener('DOMContentLoaded', () => {
    const LISTA_BODY = document.getElementById('lista-centros-body');
    const NO_DATA_MSG = document.getElementById('no-data-message');
    const FILTRO_NOMBRE = document.getElementById('filtro-nombre');
    const FILTRO_PARROQUIA = document.getElementById('filtro-parroquia');
    const FILTRO_TIPO = document.getElementById('filtro-tipo');

    const STORAGE_KEY = 'centrosDeSalud';
    let allCentrosData = {};

    // Función para obtener todos los datos del LocalStorage
    function getStorage() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            console.error("Error al parsear LocalStorage:", e);
            return {};
        }
    }

    // Función principal para renderizar la tabla
    function renderTable(dataToRender) {
        LISTA_BODY.innerHTML = ''; // Limpiar la tabla
        const centrosArray = Object.values(dataToRender); // Convertir objeto de centros a array

        if (centrosArray.length === 0) {
            NO_DATA_MSG.classList.remove('d-none');
            return;
        }

        NO_DATA_MSG.classList.add('d-none');

        centrosArray.forEach(centro => {
            const row = LISTA_BODY.insertRow();
            
            // Columna 1: RIF
            row.insertCell().textContent = centro.rif || 'N/A';
            
            // Columna 2: Nombre de la Institución
            row.insertCell().textContent = centro.datosInstitucion?.nombre || 'Sin Nombre';
            
            // Columna 3: Tipo de Institución (Necesita una lógica de mapeo o asumir un campo)
            // Aquí asumimos que el tipo está en una propiedad 'tipoInstitucion'
            row.insertCell().textContent = centro.datosInstitucion?.tipoInstitucion || 'N/A';
            
            // Columna 4: Parroquia
            row.insertCell().textContent = centro.datosInstitucion?.parroquia || 'N/A';

            // Columna 5: Director
            row.insertCell().textContent = centro.autoridades?.director?.nombre || 'N/A';

            // Columna 6: Fecha de Registro (Formateada)
            const fecha = centro.fechaRegistro ? new Date(centro.fechaRegistro).toLocaleDateString() : 'N/A';
            row.insertCell().textContent = fecha;

            // Columna 7: Acciones (Botones)
            const actionsCell = row.insertCell();
            
            // Botón Editar (redirige a la página de registro con el RIF en la URL)
            const editBtn = document.createElement('a');
            editBtn.href = `index.html?rif=${centro.rif}`;
            editBtn.className = 'btn btn-sm btn-primary me-2';
            editBtn.textContent = 'Editar';
            actionsCell.appendChild(editBtn);

            // Botón Ver Detalles (abre el Modal)
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-sm btn-info';
            viewBtn.textContent = 'Ver Detalles';
            viewBtn.setAttribute('data-bs-toggle', 'modal');
            viewBtn.setAttribute('data-bs-target', '#detalleModal');
            viewBtn.onclick = () => showDetailsModal(centro);
            actionsCell.appendChild(viewBtn);
        });
    }

    // Función para aplicar filtros dinámicos
    function applyFilters() {
        const nombreVal = FILTRO_NOMBRE.value.toLowerCase();
        const parroquiaVal = FILTRO_PARROQUIA.value.toLowerCase();
        const tipoVal = FILTRO_TIPO.value.toLowerCase();
        
        const filteredData = Object.values(allCentrosData).filter(centro => {
            const nombreRIF = `${centro.datosInstitucion?.nombre || ''} ${centro.rif || ''}`.toLowerCase();
            const parroquia = (centro.datosInstitucion?.parroquia || '').toLowerCase();
            const tipo = (centro.datosInstitucion?.tipoInstitucion || '').toLowerCase();

            // Verificar si el nombre/RIF coincide
            const matchNombre = nombreRIF.includes(nombreVal);
            
            // Verificar si la parroquia coincide
            const matchParroquia = parroquia.includes(parroquiaVal);

            // Verificar si el tipo coincide (solo si un tipo ha sido seleccionado)
            const matchTipo = tipoVal === '' || tipo === tipoVal;

            return matchNombre && matchParroquia && matchTipo;
        });

        // Convertir el array de vuelta a un objeto temporal para renderTable
        const filteredObject = filteredData.reduce((acc, curr) => {
            acc[curr.rif] = curr;
            return acc;
        }, {});

        renderTable(filteredObject);
    }
    
    // Función para mostrar los detalles completos del JSON en un modal
    function showDetailsModal(centro) {
        const jsonContent = JSON.stringify(centro, null, 2);
        document.getElementById('detalle-json-content').textContent = jsonContent;
    }

    // Inicialización: Cargar datos y renderizar
    allCentrosData = getStorage();
    renderTable(allCentrosData);

    // Agregar listeners para la funcionalidad de filtrado
    FILTRO_NOMBRE.addEventListener('input', applyFilters);
    FILTRO_PARROQUIA.addEventListener('input', applyFilters);
    FILTRO_TIPO.addEventListener('change', applyFilters);
});

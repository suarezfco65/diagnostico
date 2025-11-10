import { PARROQUIAS_CARACAS, PROYECTOS_DATA } from "../../data.js";
const proy_actuales = {
  id: "proy_actuales",
  label: "Proyectos actuales del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => {
        let proyectos = [];
        for (const key in data.proyectos) {
          if (data.proyectos[key].length > 0) {
            // Busca el label correspondiente al key en PROYECTOS_DATA
            const proyectoData = PROYECTOS_DATA.find(
              (proyecto) => proyecto.key === key
            );
            if (proyectoData) {
              proyectos.push(
                `<h6>Proyectos ${
                  proyectoData.label
                }:</h6><ol><li>${data.proyectos[key].join(
                  "</li><li>"
                )}</li></ol>`
              );
            }
          }
        }
        return proyectos.join("</br>");
      },
      label: "Proyectos Actuales",
    },
  ],
  searchFields: ["datosInstitucion.nombre", "datosInstitucion.parroquia"],
  compoundFilters: [
    {
      key: "datosInstitucion.parroquia",
      label: "Filtrar por Parroquia",
      type: "string",
      options: PARROQUIAS_CARACAS.sort(), // Usar las parroquias como opciones
    },
  ],
};
export default proy_actuales;

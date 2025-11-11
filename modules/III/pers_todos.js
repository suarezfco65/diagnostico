import { PARROQUIAS_CARACAS } from "../../data.js";
import FUNCTIONS_DEFINITIONS_BY_SECTION from "../functions-definitions.js";
const totalPersonal = FUNCTIONS_DEFINITIONS_BY_SECTION.III.totalPersonal;
const pers_todos = {
  id: "pers_todos",
  label: "Personal Total del centro médico",
  fields: [
    { key: "datosInstitucion.nombre", label: "Institución" },
    { key: "datosInstitucion.parroquia", label: "Parroquia" },
    {
      key: (data) => totalPersonal(data, ``, ``, `requerido`),
      label: "Requerido",
    },
    {
      key: (data) => totalPersonal(data, ``, ``, `disponible`),
      label: "Disponible",
    },
    {
      key: (data) =>
        (
          ((totalPersonal(data, ``, ``, `requerido`) -
            totalPersonal(data, ``, ``, `disponible`)) *
            100) /
          totalPersonal(data, ``, ``, `requerido`)
        ).toFixed(2) + "%",
      label: "Deficit (%)",
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
  chart: {(instituciones) => {
            // Datos de ejemplo
        const data = [
            { institucion: 'CDI El Valle', parroquia: 'San Bernardino', requerido: 344, disponible: 156 },
            { institucion: 'Clínica San Juan', parroquia: 'Sucre', requerido: 325, disponible: 190 },
            { institucion: 'Modulo de Salud Coche', parroquia: 'San Pedro', requerido: 383, disponible: 227 },
            { institucion: 'Ambulatorio Las Mercedes', parroquia: 'San Juan', requerido: 352, disponible: 182 },
            { institucion: 'CDI El Valle', parroquia: 'San Agustín', requerido: 330, disponible: 147 },
            { institucion: 'Clínica San Juan', parroquia: 'San Agustín', requerido: 315, disponible: 143 }
            // Agrega más datos según sea necesario
        ];

        // Agrupar datos por parroquia
        const groupedData = {};
        data.forEach(item => {
            if (!groupedData[item.parroquia]) {
                groupedData[item.parroquia] = { requerido: 0, disponible: 0, instituciones: [] };
            }
            groupedData[item.parroquia].requerido += item.requerido;
            groupedData[item.parroquia].disponible += item.disponible;
            groupedData[item.parroquia].instituciones.push({
                name: item.institucion,
                requeridos: item.requerido,
                disponibles: item.disponible
            });
        });

        // Preparar datos para el gráfico
        const seriesData = [];
        const drilldownData = [];

        for (const parroquia in groupedData) {
            const { requerido, disponible, instituciones } = groupedData[parroquia];
            const deficit = ((requerido - disponible) / requerido) * 100;

            seriesData.push({
                name: parroquia,
                y: requerido,
                drilldown: parroquia,
                available: disponible,
                deficit: deficit.toFixed(2) // Guardar el porcentaje de déficit
            });

            drilldownData.push({
                id: parroquia,
                data: instituciones.map(inst => [
                    inst.name,
                    inst.requeridos,
                    inst.disponibles,
                    ((inst.requeridos - inst.disponibles) / inst.requeridos * 100).toFixed(2) // Porcentaje de déficit
                ])
            });
        }

        // Crear el gráfico
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Personal Requerido y Disponible por Parroquia con Drilldown'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Cantidad de Personal'
                }
            },
            tooltip: {
                pointFormat: 'Requerido: <b>{point.y}</b><br/>Disponible: <b>{point.available}</b><br/>Déficit: <b>{point.deficit}%</b>'
            },
            series: [{
                name: 'Parroquias',
                colorByPoint: true,
                data: seriesData.map(item => ({
                    name: item.name,
                    y: item.y,
                    drilldown: item.drilldown,
                    available: item.available,
                    deficit: item.deficit
                }))
            }],
            drilldown: {
                series: drilldownData.map(item => ({
                    id: item.id,
                    data: item.data.map(inst => [
                        inst[0], // Nombre de la institución
                        inst[1], // Personal requerido
                        inst[2], // Personal disponible
                        inst[3]  // Porcentaje de déficit
                    ])
                }))
            }
        });
    }
};
export default pers_todos;

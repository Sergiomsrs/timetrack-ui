/**
 * Procesa un array de timestamps de trabajo y los organiza por días, calculando períodos trabajados.
 * @param {Array<Object>} timestamps - Array de objetos con registros de tiempo.
 * @param {number} timestamps[].id - ID único del registro.
 * @param {string} timestamps[].timestamp - Fecha/hora en formato ISO (ej: "2025-04-04T08:00:00").
 * @param {number} timestamps[].employeeId - ID del empleado.
 * @param {number|string} id - ID del empleado o grupo a procesar.
 * @returns {Array<Object>} Array de días procesados con detalles de trabajo.
 * @property {number} id - ID pasado como parámetro.
 * @property {Object} data - Datos procesados del día.
 * @property {string} data.day - Fecha en formato local (ej: "04/04/2025").
 * @property {Array<Object>} data.periods - Períodos de trabajo del día.
 * @property {string} data.periods[].entry - Hora de entrada (ej: "08:00").
 * @property {string|null} data.periods[].exit - Hora de salida (o null si falta).
 * @property {number} data.periods[].durationMs - Duración en milisegundos.
 * @property {boolean} data.periods[].isComplete - Si el período tiene entrada y salida.
 * @property {string} data.totalWorked - Tiempo total trabajado (ej: "7h 30m" o "--").
 * @property {number} data.recordsCount - Número de registros para el día.
 * @property {string|null} data.warning - Mensaje de advertencia (ej: registros impares).
 * @throws {TypeError} Si timestamps no es un array o los objetos no tienen timestamp.
 * @example
 * // Uso básico
 * const registros = [
 *   { id: 1, timestamp: "2025-04-04T08:00:00", employeeId: 1 },
 *   { id: 2, timestamp: "2025-04-04T15:00:00", employeeId: 1 }
 * ];
 * const resultado = processTimeStamps(registros, 101);
 * // resultado: [
 * //   {
 * //     id: 101,
 * //     data: {
 * //       day: "04/04/2025",
 * //       periods: [{ entry: "08:00", exit: "15:00", ... }],
 * //       totalWorked: "7h 0m",
 * //       recordsCount: 2,
 * //       warning: null
 * //     }
 * //   }
 * // ]
 */

export const processTimeStamps = (timestamps, id) => {
    
    const daysMap = new Map();

    // 1. Agrupar registros por día y ordenar por hora
    timestamps.forEach(stamp => {
        const date = new Date(stamp.timestamp);
        const dayKey = date.toLocaleDateString('es-ES');

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, []);
        }

        daysMap.get(dayKey).push(date);
    });

    // 2. Procesar cada día
    return Array.from(daysMap.entries()).map(([day, times]) => {
        times.sort((a, b) => a - b); // Ordenar cronológicamente

        let totalWorkedMs = 0; // Acumulador de tiempo trabajado en milisegundos
        const periods = []; // Array para almacenar cada período de trabajo
        let warning = null; // Para registrar problemas como registros impares

        // 3. Calcular períodos de trabajo
        for (let i = 0; i < times.length; i += 2) {
            const entry = times[i];
            let exit, periodMs;

            if (i + 1 < times.length) {
                // Par completo (entrada-salida)
                exit = times[i + 1];
                periodMs = exit - entry;
                totalWorkedMs += periodMs;
            } else {
                // Registro impar (falta salida)
                exit = null;
                periodMs = 0;
                warning = "⚠ Falta registro de salida";
            }

            periods.push({
                entry: entry.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                exit: exit?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                durationMs: periodMs,
                isComplete: exit !== null
            });
        }

        // 4. Formatear horas totales
        const totalWorked = formatMillisecondsToTime(totalWorkedMs);

        return  {
            id,
            data: {
                day,
                periods,
                totalWorked,
                recordsCount: times.length,
                warning
            }}
    });
};



/**
 * Convierte milisegundos a formato legible 00:00 o --:--.
 * @param {number} ms - Tiempo en milisegundos.
 * @param {string} [emptySymbol="--"] - Símbolo para mostrar cuando ms ≤ 0.
 * @returns {string} - Tiempo formateado (ej: "2h 30m" o "--").
 */
export const formatMillisecondsToTime = (ms, emptySymbol = "--") => {
    if (ms <= 0) return emptySymbol;
  
    const totalHours = Math.floor(ms / 3600000); // 1h = 3600000 ms
    const totalMinutes = Math.floor((ms % 3600000) / 60000); // 1m = 60000 ms
  
    return `${totalHours}h ${totalMinutes}m`;
  };
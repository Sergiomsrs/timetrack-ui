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

    // 1. Agrupar registros por día, manteniendo fecha + id
    timestamps.forEach(stamp => {
        const date = new Date(stamp.timestamp);
        const dayKey = date.toLocaleDateString('es-ES');

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, []);
        }

        // Guardar tanto la fecha como el id
        daysMap.get(dayKey).push({
            date,
            recordId: stamp.id
        });
    });

    // 2. Procesar cada día
    return Array.from(daysMap.entries()).map(([day, times]) => {
        // Ahora times es un array de objetos { date, recordId }

        // Ordenar por fecha
        times.sort((a, b) => a.date - b.date);

        let totalWorkedMs = 0;
        const periods = [];
        let warning = null;

        // 3. Calcular períodos
        for (let i = 0; i < times.length; i += 2) {
            const entry = times[i];
            let exit, periodMs;

            if (i + 1 < times.length) {
                exit = times[i + 1];
                periodMs = exit.date - entry.date;
                totalWorkedMs += periodMs;
            } else {
                exit = null;
                periodMs = 0;
                warning = "⚠ Falta registro de salida";
            }

            periods.push({
                entry: entry.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                entryID: entry.recordId, // ID de la entrada
                exit: exit?.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                exitID: exit?.recordId || "", // ID de la salida (si existe)
                durationMs: periodMs,
                isComplete: exit !== null,
                recordId: entry.recordId // Usar el id correcto de la entrada
            });
        }

        const totalWorked = formatMillisecondsToTime(totalWorkedMs);

        return {
            id,
            data: {
                day,
                periods,
                totalWorked,
                recordsCount: times.length,
                warning
            }
        };
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


  export const filterAndMapRecords = (records, day) => {
    if (!records || !day) return [];
  
    const [d, m, y] = day.split('/').map(Number);
  
    const filtered = records.filter(record => {
      const date = new Date(record.timestamp);
      return (
        date.getDate() === d &&
        date.getMonth() === m - 1 &&
        date.getFullYear() === y
      );
    });
  
    return filtered.map(r => {
      const date = new Date(r.timestamp);
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toISOString().slice(0, 10); // yyyy-mm-dd
      return { ...r, time, dateStr };
    });
  };

  // utils/dateHelpers.js
export const formatTimeForInput = (timestamp) => {
    if (!timestamp) return '00:00'; // Fallback for invalid dates
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '00:00'; // Check if date is invalid
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '00:00'; // Fallback if any error occurs
    }
  };
  
  export const parseTimeInput = (timeString) => {
    if (!timeString || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      return { hours: 0, minutes: 0 };
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };
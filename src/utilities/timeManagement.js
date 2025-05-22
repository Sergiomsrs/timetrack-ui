export const processTimeStamps = (timestamps, id) => {

  console.log("Timestamps:", timestamps);
    const daysMap = new Map();

    // 1. Agrupar registros por día
    timestamps.forEach(stamp => {
        const date = new Date(stamp.timestamp);
        const enrichedStamp = {
            timestamp: date,
            isMod: stamp.isMod
        };

        const dayKey = date.toLocaleDateString('es-ES');

        if (!daysMap.has(dayKey)) {
            daysMap.set(dayKey, []);
        }

        daysMap.get(dayKey).push(enrichedStamp);
    });

    // 2. Procesar cada día
    return Array.from(daysMap.entries()).map(([day, times]) => {
        times.sort((a, b) => a.timestamp - b.timestamp); // Ordenar cronológicamente
        // Se inicializan las variables necesarias para el procesamiento
        let totalWorkedMs = 0;
        const periods = [];
        let warning = null;
        // Se recorre el array de tiempos, tomando pares de entrada y salida
        for (let i = 0; i < times.length; i += 2) {
            const entry = times[i];
            let exit, periodMs;

            if (i + 1 < times.length) {
                exit = times[i + 1];
                periodMs = exit.timestamp - entry.timestamp;
                totalWorkedMs += periodMs;
            } else {
                exit = null;
                periodMs = 0;
                warning = "⚠ Pendiente de revisión";
            }
            // Se formatean las fechas y se añaden a la lista de periodos
            periods.push({
                entry: entry.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                entryIsMod: entry.isMod,

                exit: exit?.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                exitIsMod: exit?.isMod,

                durationMs: periodMs,
                isComplete: exit !== null
            });
        }
        // Se formatea el tiempo total trabajado
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



export const formatMillisecondsToTime = (ms, emptySymbol = "--") => {
    if (ms <= 0) return emptySymbol;
  
    const totalHours = Math.floor(ms / 3600000); 
    const totalMinutes = Math.floor((ms % 3600000) / 60000); 
  
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
      const dateStr = date.toISOString().slice(0, 10); 
      return { ...r, time, dateStr };
    });
  };

  export const saludo = () => {
    const hour = new Date().getHours();
    if (hour < 14) {
      return "Buenos días";
    } else if (hour < 21) {
      return "Buenas tardes";
    } else {
      return "Buenas noches";
    }
  };
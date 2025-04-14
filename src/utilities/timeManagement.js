

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

        let totalWorkedMs = 0;
        const periods = [];
        let warning = null;

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
        const totalHours = Math.floor(totalWorkedMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor((totalWorkedMs % (1000 * 60 * 60)) / (1000 * 60));
        const totalWorked = totalWorkedMs > 0 ? `${totalHours}h ${totalMinutes}m` : "--";

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
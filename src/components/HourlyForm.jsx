import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext ';

export const HourlyForm = ({ employeeToDelete }) => {

  const { auth } = useContext(AuthContext);


  const [schedules, setSchedules] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [newSchedule, setNewSchedule] = useState({
    dayNumber: 1, // Valor por defecto: Lunes
    hora: ''
  });

  const dayNames = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo"
  };

useEffect(() => {
  if (employeeToDelete?.id) {
    fetch(`http://localhost:8080/api/horarios/user/${employeeToDelete.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener los horarios");
        }
        return res.json();
      })
      .then(setSchedules)
      .catch((error) => console.error("Error cargando horarios:", error));
  }
}, [employeeToDelete]);


  const grouped = schedules.reduce((acc, item, index) => {
    const day = item.dayNumber;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...item, index });
    return acc;
  }, {});

  const sortedDays = Object.keys(grouped).sort((a, b) => a - b);

  const handleChange = (index, newHora) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], hora: newHora };
    setSchedules(updated);
  };

  const handleNewScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: name === 'dayNumber' ? parseInt(value) : value
    }));
  };

const handleAddSchedule = async () => {
  if (!newSchedule.hora) {
    alert('Por favor selecciona una hora');
    return;
  }

  // Mapeo de días en español a inglés
  const dayNamesEnglish = {
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
    7: "SUNDAY"
  };

  // Formatear la hora a HH:MM:SS
  const formattedTime = newSchedule.hora + ":00";

  const newEntry = {
    dni: employeeToDelete.dni,
    hora: formattedTime,
    dia: dayNamesEnglish[newSchedule.dayNumber]
  };

  try {
    setIsSaving(true);
    
    const response = await fetch("http://localhost:8080/api/horarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEntry)
    });

    if (!response.ok) {
      throw new Error("Error al guardar el horario");
    }

    const result = await response.text();
    console.log(result);

    // Actualizar el estado local con el formato interno de la app
    setSchedules(prev => [...prev, {
      ...newEntry,
      dia: dayNames[newSchedule.dayNumber], // Mantener el nombre en español localmente
      dayNumber: newSchedule.dayNumber
    }]);
    
    // Resetear el formulario
    setNewSchedule({
      dayNumber: 1,
      hora: ''
    });

    setSaveMessage("Horario añadido correctamente");
    
  } catch (error) {
    console.error("Error:", error);
    setSaveMessage("Error al añadir el horario");
  } finally {
    setIsSaving(false);
  }
};

const asignarHorarioPorDefecto = async () => {
  try {
    setIsSaving(true);
    const response = await fetch(
      `http://localhost:8080/api/horarios/default/${employeeToDelete.dni}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al asignar horario por defecto");
    }

    // Vuelve a cargar los horarios del empleado
    const horariosResponse = await fetch(
      `http://localhost:8080/api/horarios/user/${employeeToDelete.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (!horariosResponse.ok) {
      throw new Error("Error al recargar horarios");
    }

    const horarios = await horariosResponse.json();
    setSchedules(horarios); // Actualiza el estado con los nuevos horarios
    setSaveMessage("Horario por defecto asignado correctamente");

  } catch (error) {
    console.error("Error:", error);
    setSaveMessage("Error al asignar horario por defecto");
  } finally {
    setIsSaving(false);
  }
};

  const handleSave = () => {
    console.log("Guardando horarios:", schedules);
    setIsSaving(true);
    setSaveMessage("");

    fetch("http://localhost:8080/api/horarios/horarios/all", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(schedules)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.text();
      })
      .then(() => {
        setSaveMessage("Cambios guardados correctamente");
      })
      .catch((err) => {
        console.error(err);
        setSaveMessage("Error al guardar los registros");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleDeleteSchedule = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/api/horarios/${id}`, {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el horario");
    }

    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    setSaveMessage("Horario eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar el horario:", error);
    setSaveMessage("Error al eliminar el horario");
  }
};

return (
  <div className="border border-gray-200 rounded-2xl shadow bg-white p-4">
    {schedules.length === 0 && (
      <button
        onClick={() => asignarHorarioPorDefecto()}
        className="mb-6 w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
      >
        Asignar horario por defecto
      </button>
    )}

    <div className="mb-8 p-6 border border-gray-200 rounded-2xl shadow bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Añadir nuevo horario</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dayNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Día de la semana
          </label>
          <select
            name="dayNumber"
            value={newSchedule.dayNumber}
            onChange={handleNewScheduleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(dayNames).map(([num, name]) => (
              <option key={num} value={num}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hora" className="block text-sm font-medium text-gray-700 mb-1">
            Hora
          </label>
          <input
            type="time"
            name="hora"
            value={newSchedule.hora}
            onChange={handleNewScheduleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>


        <div className="flex items-end">
          <button
            onClick={handleAddSchedule}
            className="rounded-md cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
            Añadir
          </button>
        </div>
      </div>
    </div>
    <div className="mb-6">
      <span className="text- font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded shadow-sm">
                 <strong>Empleado:  </strong> {employeeToDelete.name} {employeeToDelete.lastName}
                  </span>

            
    </div>

    <div className="flex flex-wrap gap-2 mb-8 w-full">
      {sortedDays.map((dayNum) => (
        <div
          key={dayNum}
          className="p-5 border border-gray-200 rounded-2xl shadow bg-white"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {dayNames[dayNum]}
          </h3>
          <div className="flex flex-col gap-3">
            {grouped[dayNum].map((schedule, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="time"
                  value={schedule.hora || ""}
                  onChange={(e) => handleChange(schedule.index, e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900"
                />
                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300shadow-lg shadow-red-500/50 font-medium rounded-lg text-sm px-2 py-0.5 text-center me-0 mb-0 cursor-pointer"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <button
      onClick={handleSave}
      disabled={isSaving}
      className={`w-full sm:w-auto px-4 py-2 rounded-md font-semibold text-sm transition cursor-pointer ${
        isSaving
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      }`}
    >
      {isSaving ? "Guardando..." : "Guardar cambios"}
    </button>

    {saveMessage && (
      <p className="mt-4 text-sm text-green-600">{saveMessage}</p>
    )}
  </div>
);

};

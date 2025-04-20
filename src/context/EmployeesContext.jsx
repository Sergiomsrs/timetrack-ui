// src/context/EmployeesContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedEmployee, setEditedEmployee] = useState(null)  

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8080/api/user');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/user");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error cargando empleados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(); // 🔁 Se ejecuta al montar el provider
  }, []);

  return (
    <EmployeesContext.Provider value={{ 
        employees, 
        loading,
        editedEmployee,

        setEmployees, 
        fetchEmployees, 
        refreshEmployees,
        setEditedEmployee }}>
      {children}
    </EmployeesContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto
export const useEmployees = () => useContext(EmployeesContext);

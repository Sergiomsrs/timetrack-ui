// src/context/EmployeesContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext ';

const EmployeesContext = createContext();

export const EmployeesProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedEmployee, setEditedEmployee] = useState(null)
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const {auth} = useContext(AuthContext);
  

  const fetchEmployees = async (search = "") => {
    try {
      setLoading(true);
      
      const url = search
        ? `http://localhost:8080/api/user/search?name=${search}&page=${page}&size=10`
        : `http://localhost:8080/api/user/pag?page=${page}&size=10`;

        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}` // ← Aquí va el token
          }
        });

    
        if (!res.ok) {
          throw new Error("Fallo al obtener empleados");
        }
      const data = await res.json();
      setEmployees(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, [page]);

  return (
    <EmployeesContext.Provider value={{
      employees,
      loading,
      editedEmployee,
      totalPages,
      page,
      searchTerm,
      
    
      setSearchTerm,
      setPage,
      setEmployees,
      setTotalPages,
      fetchEmployees,
      setEditedEmployee
    }}>
      {children}
    </EmployeesContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useEmployees = () => useContext(EmployeesContext);

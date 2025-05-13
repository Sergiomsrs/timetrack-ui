import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext ";


export const useRecord = () => {
  const [records, setRecords] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedDayRecords, setSelectedDayRecords] = useState(null);
  const [lastThree, setLastThree] = useState([]);

  const { auth } = useContext(AuthContext);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener empleados');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async (activeTab) => {
    if (!selectedEmployeeId) {
      setRecords([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      const response = await fetch(
        `http://localhost:8080/api/timestamp/employee/${(auth.role == "ADMIN" || auth.role == "GUEST") ? selectedEmployeeId : auth.user.id}/month?year=${activeTab.year}&month=${activeTab.month + 1}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      setError("Error al cargar registros");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastThree = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/timestamp/last3"); 
    const data = await res.json();
    setLastThree(data);
  } catch (err) {
    console.error("Error al cargar los últimos registros:", err);
  }
};


  return {

    fetchEmployees,
    fetchRecords,
    fetchLastThree,

    records,
    error,
    employees,
    isLoading,
    selectedEmployeeId,
    selectedDayRecords,
    lastThree,

    setRecords,
    setError,
    setEmployees,
    setIsLoading,
    setSelectedEmployeeId,
    setSelectedDayRecords,
    setLastThree
  };



}
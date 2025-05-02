import { useState } from "react";


export const useRecord = () => {
  const [records, setRecords] = useState([]);
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [selectedDayRecords, setSelectedDayRecords] = useState(null);
  


  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:8080/api/user');
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
        //const response = await fetch(`http://localhost:8080/api/timestamp/employee/${selectedEmployeeId}`);
        const response = await fetch(`http://localhost:8080/api/timestamp/employee/${selectedEmployeeId}/month?year=${activeTab.year}&month=${activeTab.month + 1}`);
        const data = await response.json();
        setRecords(data);
    } catch (error) {
        setError("Error al cargar registros");
    } finally {
        setIsLoading(false);
    }
};

return {
    
    fetchEmployees,
    fetchRecords, 
    
    records,
    error,
    employees,
    isLoading,
    selectedEmployeeId, 
    selectedDayRecords, 
    
    setRecords,
    setError,
    setEmployees,
    setIsLoading,
    setSelectedEmployeeId,
    setSelectedDayRecords
  };



}


export const fetchRecords = async (selectedEmployeeId, activeTab) => {
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
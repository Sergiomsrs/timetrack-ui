import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const DatePicker = ({ activeTab, setActiveTab, setIsModalAddOpen, selectedEmployeeId, employees }) => {
  
  const { auth } = useContext(AuthContext);
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();


  


  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); 

  const handleMonthChange = (e) => {
    setActiveTab({ ...activeTab, month: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    setActiveTab({ ...activeTab, year: parseInt(e.target.value) });
  };

  const downloadMonthlyReportPdf = async (employeeId, year, month) => {
    const emp = employees.find(emp => emp.id == selectedEmployeeId);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/report/employee/${employeeId}/report/pdf/monthly?year=${year}&month=${month + 1}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/pdf',
            Authorization: `Bearer ${auth.token}`
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  
      // Nombre del archivo
      a.download = `Informe_Jornadas_${emp.name}_${emp.lastName}_${months[month]}_${year}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      alert('No se pudo descargar el PDF');
    }
  };


  return (
    <div className="rounded-lg border border-violet-200 bg-white p-4 w-fit mx-1 flex flex-wrap gap-4 h-fit mb-4">
      <div className='w-full'>

      <select
        value={activeTab.year ?? currentYear}
        onChange={handleYearChange}
        className="w-full cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base  bg-violet-600 text-white shadow-md"
        >
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
        </div>
      
        <div className='w-full'>


      <select
        value={activeTab.month ?? currentMonth}
        onChange={handleMonthChange}
        className="w-full rounded-md border px-4 py-2 text-sm md:text-base text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
        >
        {months.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>
        </div>

<div className='w-full'>

{auth.role == "ADMIN" &&  
      <button
      className="w-full text-sm rounded-md border px-4 py-2 text-violet-600 hover:text-amber-50 hover:bg-violet-600 cursor-pointer"
      onClick={() => setIsModalAddOpen(true)}
      >
        Añadir registro
      </button>
}
        </div>

        <div className='w-full'>


{(auth.role == "ADMIN" || auth.role == "GUEST")  &&  

<button
       className="w-full text-sm rounded-md border px-4 py-2 text-violet-600 hover:text-amber-50 hover:bg-violet-600 cursor-pointer"
       onClick={() => downloadMonthlyReportPdf(selectedEmployeeId, activeTab.year, activeTab.month)}
       >
      Descargar PDF
      </button>
        
}
        </div>
    </div>
  );
};

import React, { useEffect } from 'react';

export const DatePicker = ({ activeTab, setActiveTab }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i); // Rango de años: 5 atrás y 4 adelante

  const handleMonthChange = (e) => {
    setActiveTab({ ...activeTab, month: parseInt(e.target.value) });
  };

  const handleYearChange = (e) => {
    setActiveTab({ ...activeTab, year: parseInt(e.target.value) });
  };


  return (
    <div className="rounded-lg border border-violet-200 bg-white p-4 w-fit mx-4 flex flex-col gap-4 h-fit">
      
      <select
        value={activeTab.year ?? currentYear}
        onChange={handleYearChange}
        className="cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 bg-violet-600 text-white shadow-md"
        >
        {years.map((year) => (
            <option key={year} value={year}>{year}</option>
        ))}
      </select>
      
      <select
        value={activeTab.month ?? currentMonth}
        onChange={handleMonthChange}
        className="rounded-md border px-4 py-2 text-sm md:text-base text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {months.map((month, index) => (
          <option key={index} value={index}>{month}</option>
        ))}
      </select>

      
    </div>
  );
};

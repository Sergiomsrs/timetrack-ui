import { useState } from 'react'


import { DatePicker } from '../components/DatePicker';
import { useRecord } from '../Hooks/useRecord';
import { TimetrackList } from '../components/TimetrackList';

export const TimeTrackView = () => {

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const { 
          fetchRecords, 
          fetchEmployees,
          
          records, 
          employees, 
          error, 
          isLoading, 
          selectedEmployeeId,
          selectedDayRecords,
           
          
          setRecords, 
          setEmployees, 
          setError, 
          setIsLoading, 
          setSelectedDayRecords,
          setSelectedEmployeeId 
      
      } = useRecord();


  

  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-11
  });

  
    return (
      <div className="flex flex-col items-center lg:flex-row lg:items-start  w-full">
        <div className="w-6/8   lg:w-2/12 flex justify-center  ">
  
          <DatePicker 
          employees={employees}
          setActiveTab={setActiveTab} 
          activeTab={activeTab} 
          setIsModalAddOpen={setIsModalAddOpen}
          selectedEmployeeId={selectedEmployeeId}
          />
  
        </div>
        <div className="w-full lg:w-9/12  px-0 overflow-hidden ">

          <TimetrackList 
          activeTab={activeTab}
          isModalAddOpen={isModalAddOpen}
          setIsModalAddOpen={setIsModalAddOpen}
          fetchRecords={fetchRecords}
          fetchEmployees={fetchEmployees}
          
          records={records}
          employees={employees} 
          error={error}
          isLoading={isLoading}
          selectedEmployeeId={selectedEmployeeId}
          selectedDayRecords={selectedDayRecords}
           
          
          setRecords={setRecords}
          setEmployees={setEmployees}
          setError={setError}
          setIsLoading={setIsLoading}
          setSelectedDayRecords={setSelectedDayRecords}
          setSelectedEmployeeId={setSelectedEmployeeId}
          />
  
        </div>
        <div className='w-full md:w-1/12 flex justify-center mx-0 px-0'>
        </div>
      </div>
  
    );
}

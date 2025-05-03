import React, { useEffect, useState } from 'react'
import { ActiveTab } from '../components/ActiveTab';
import UserForm from '../components/UserForm';
import { UserList } from '../components/UserList';
import { TimetrackList } from './TimetrackList';
import { DatePicker } from '../components/DatePicker';
import { useRecord } from '../Hooks/useRecord';

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
      <div className="flex w-full">
        <div className="w-2/8 flex justify-center  mx-0 px-0">
  
          <DatePicker 
          employees={employees}
          setActiveTab={setActiveTab} 
          activeTab={activeTab} 
          setIsModalAddOpen={setIsModalAddOpen}
          selectedEmployeeId={selectedEmployeeId}
          />
  
        </div>
        <div className="w-5/8  mx-0 px-0 ">

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
        <div className='w-1/8 flex justify-center mx-0 px-0'>
        </div>
      </div>
  
    );
}

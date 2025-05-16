import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import { UserList } from '../components/UserList';
import { ActiveTab } from '../components/ActiveTab';
import { HourlyForm } from '../components/HourlyForm';

export const User = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  

  return (
    <div className="flex w-full">
      <div className="w-1/8 flex justify-center mx-8 ">

        <ActiveTab setActiveTab={setActiveTab} activeTab={activeTab} />

      </div>
      <div className="w-6/8 ml-10 ">

        {activeTab === "form" && (<UserForm setActiveTab={setActiveTab} />)}
        {activeTab === "list" && (<UserList setActiveTab={setActiveTab} employeeToDelete={employeeToDelete} setEmployeeToDelete={setEmployeeToDelete} />)}
        {activeTab === "hourly" && (<HourlyForm setActiveTab={setActiveTab} employeeToDelete={employeeToDelete} setEmployeeToDelete={setEmployeeToDelete} />)}

      </div>
      <div className='w-1/8 flex justify-center'>
      </div>
    </div>

  );
};

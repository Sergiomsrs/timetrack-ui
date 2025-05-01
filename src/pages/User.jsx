import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import { UserList } from '../components/UserList';
import { ActiveTab } from '../components/ActiveTab';

export const User = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="flex w-full">
      <div className="w-2/8 flex justify-center ">

        <ActiveTab setActiveTab={setActiveTab} activeTab={activeTab} />

      </div>
      <div className="w-5/8 ">

        {activeTab === "form" && (<UserForm setActiveTab={setActiveTab} />)}
        {activeTab === "list" && (<UserList setActiveTab={setActiveTab} />)}

      </div>
      <div className='w-1/8 flex justify-center'>
      </div>
    </div>

  );
};

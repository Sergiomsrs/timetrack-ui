import React, { useState } from 'react';
import UserForm from '../components/UserForm';
import { UserList } from '../components/UserList';
import { ActiveTab } from '../components/ActiveTab';

export const User = () => {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <div class="flex w-full">
      <div class="w-2/8 flex justify-center ">

        <ActiveTab setActiveTab={setActiveTab} activeTab={activeTab} />

      </div>
      <div class="w-4/8 ">

{activeTab === "form" && (<UserForm />)}
{activeTab === "list" && (<UserList setActiveTab={setActiveTab} />)}

</div>
      <div className='w-2/8 flex justify-center'> 
      </div>
    </div>

  );
};

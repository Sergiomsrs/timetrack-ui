import React, { useState } from 'react'
import { ActiveTab } from '../components/ActiveTab';
import UserForm from '../components/UserForm';
import { UserList } from '../components/UserList';
import { TimetrackList } from './TimetrackList';
import { DatePicker } from '../components/DatePicker';

export const TimeTrackView = () => {
  const [activeTab, setActiveTab] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-11
  });

  console.log(activeTab)
  
    return (
      <div className="flex w-full">
        <div className="w-2/8 flex justify-center  mx-0 px-0">
  
          <DatePicker setActiveTab={setActiveTab} activeTab={activeTab} />
  
        </div>
        <div className="w-5/8  mx-0 px-0 ">

          <TimetrackList activeTab={activeTab} />
  
        </div>
        <div className='w-1/8 flex justify-center mx-0 px-0'>
        </div>
      </div>
  
    );
}

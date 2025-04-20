import React from 'react'

export const ActiveTab = ({activeTab, setActiveTab}) => {
  return (


    <div className="rounded-lg border border-violet-200 bg-white p-1 sm:flex-row gap-1 w-fit h-fit py-4 mx-4">
   
    <div
      onClick={() => setActiveTab("form")}
      className={`cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 transition-all duration-300 ${
        activeTab === "form"
          ? "bg-violet-600 text-white shadow-md"
          : "bg-white text-violet-600 hover:bg-violet-50"
      }`}
    >
      Añadir Usuario
    </div>
    <div
      onClick={() => setActiveTab("list")}
      className={`cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 transition-all duration-300 ${
        activeTab === "list"
          ? "bg-violet-600 text-white shadow-md"
          : "bg-white text-violet-600 hover:bg-violet-50"
      }`}
    >
      Lista de Usuarios
    </div>
  </div>
  )
}

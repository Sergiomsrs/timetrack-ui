
export const ActiveTab = ({activeTab, setActiveTab}) => {
  
  
  return (
    <div className="rounded-lg border border-violet-200 bg-white p-4 w-fit mx-4 flex flex-row md:flex-col h-fit gap-4 mb-4">
   
   <div
  onClick={() => setActiveTab("list")}
  className={`cursor-pointer rounded-md px-4 py-2 text-xs sm:text-sm font-medium md:text-base lg:px-6 transition-all duration-300 ${
    activeTab === "list"
      ? "bg-violet-600 text-white shadow-md"
      : activeTab === "form"
      ? "bg-white text-violet-600 hover:bg-violet-50"
      : activeTab === "hourly"
      ? "bg-white text-violet-600 border-2 border-violet-600" 
      : "bg-white text-violet-600 hover:bg-violet-50"
  }`}
>
  Lista de Usuarios
</div>
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
  </div>
  )
}

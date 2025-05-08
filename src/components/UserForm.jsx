import { useEffect, useState } from 'react'
import { useEmployees } from '../context/EmployeesContext'

const initialValues = { name: '', lastName: '', secondLastName: '', email: '', dni: '', password: '', accesLevel: '', role: 'USER' }


export default function UserForm({ setActiveTab }) {
  const [formData, setFormData] = useState(initialValues)

  const { editedEmployee, setEditedEmployee, fetchEmployees } = useEmployees();

  const resetForm = () => {
    setFormData(initialValues);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editedEmployee ? 'PUT' : 'POST';
      const url = editedEmployee
        ? `http://localhost:8080/api/user/${editedEmployee.id}`
        : 'http://localhost:8080/api/user';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          secondLastName: formData.secondLastName,
          email: formData.email,
          dni: formData.dni,
          password: formData.password,
          accessLevel: "",
          role: formData.role || 'USER',
        }),
      });
      console.log("body", formData)

      if (!response.ok) {
        throw new Error('Error al guardar el usuario');
      }
      const data = await response.json();
      alert(editedEmployee ? 'Usuario actualizado con éxito' : 'Usuario guardado con éxito');
      fetchEmployees();
      setActiveTab("list")


      setFormData({
        name: '',
        lastName: '',
        secondLastName: '',
        email: '',
        dni: '',
        password: '',
        accesLevel: '',
        role: 'USER'
      });



      setEditedEmployee(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al guardar el usuario');
    }
  };

  useEffect(() => {
    if (editedEmployee) {
      setFormData({
        name: editedEmployee.name || '',
        lastName: editedEmployee.lastName || '',
        secondLastName: editedEmployee.secondLastName || '',
        email: editedEmployee.email || '',
        dni: editedEmployee.dni || '',
        password: editedEmployee.password || '',
        accesLevel: editedEmployee.accesLevel || '',
        role: editedEmployee.role || ''
      });
    }
  }, [editedEmployee]);


  return (
    <div className="flex flex-col justify-center items-center mb-4" >
      <div className=" flex flex-col justify-center items-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Registrar Nuevo Usuario</h2>
        <p className="mt-2 text-lg text-gray-600">Completar todos los campos</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
              Nombre
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900">
              Primer Apellido
            </label>
            <div className="mt-2.5">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
          <div>
            <label htmlFor="secondLastName" className="block text-sm font-semibold text-gray-900">
              Segundo Apellido
            </label>
            <div className="mt-2.5">
              <input
                id="secondLastName"
                name="secondLastName"
                type="text"
                autoComplete="family-name"
                value={formData.secondLastName}
                onChange={(e) => setFormData({ ...formData, secondLastName: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="dni" className="block text-sm font-semibold text-gray-900">
              DNI
            </label>
            <div className="mt-2.5">
              <input
                id="dni"
                name="dni"
                type="text"
                autoComplete="organization"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Contraseña
            </label>
            <div className="mt-2.5">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

          </div>

          <div className="">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-900">
              Rol de Usuario
            </label>
            <div className="mt-2.5">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
                <option value="GUEST">Invitado</option>
              </select>
            </div>
          </div>



        </div>
        <div className="flex flex-col gap-2 w-1/2     mt-10">
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {formData == initialValues ? 'Registrar Usuario' : 'Actualizar Usuario'}
          </button>
          <button
            onClick={() => resetForm()}
            type="button"
            className="w-full rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Resetear Formulario
          </button>
        </div>
      </form>
    </div>
  )
}

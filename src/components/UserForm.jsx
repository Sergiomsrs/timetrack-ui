import { useContext, useEffect, useState } from 'react'
import { useEmployees } from '../context/EmployeesContext'
import { AuthContext } from '../context/AuthContext ';
import { ConfirmModal } from './ConfirmationModal';

const initialValues = { name: '', lastName: '', secondLastName: '', email: '', dni: '', password: '', accesLevel: '', role: 'USER', fechaAlta: '', fechaBaja: '' };


export default function UserForm({ setActiveTab }) {
  const [formData, setFormData] = useState(initialValues)

  const { editedEmployee, setEditedEmployee, fetchEmployees, employees } = useEmployees();

  const { auth } = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [errors, setErrors] = useState({});

  console.log(employees)


  const validate = () => {
  const newErrors = {};

  if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
  if (!formData.lastName.trim()) newErrors.lastName = 'El primer apellido es obligatorio';
  if (!formData.email.trim()) {
    newErrors.email = 'El correo electrónico es obligatorio';
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = 'Correo electrónico no válido';
  }
  if (!formData.dni.trim()) {
    newErrors.dni = 'El DNI es obligatorio';
  } else if (!editedEmployee && employees.some(emp => emp.dni === formData.dni.trim())) {
    newErrors.dni = 'Este DNI ya está registrado';
  }
  if (!editedEmployee && !formData.password.trim()) {
    newErrors.password = 'La contraseña es obligatoria';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  
   

  const resetForm = () => {
    setFormData(initialValues);
    setEditedEmployee(null);
  }


  const submitForm = async () => {
    try {
      const method = editedEmployee ? 'PUT' : 'POST';
      const url = editedEmployee
        ? `http://localhost:8080/api/user/${editedEmployee.id}`
        : 'http://localhost:8080/api/user';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
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
          fechaAlta: formData.fechaAlta,
          fechaBaja: formData.fechaBaja,
          
        }),
      });

      if (!response.ok) throw new Error('Error al guardar el usuario');

      
      fetchEmployees();
      setActiveTab("list");
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al guardar el usuario');
    }
  };

const handleFormSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    setShowConfirmModal(true);
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
        password:  '',
        accesLevel: editedEmployee.accesLevel || '',
        role: editedEmployee.role || '',
        fechaAlta: editedEmployee.fechaAlta || '',
        fechaBaja: editedEmployee.fechaBaja || '',
      });
    }
  }, [editedEmployee]);


  return (
    <div className="flex flex-col justify-center items-center mb-4" >
      <div className=" flex flex-col justify-center items-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Registrar Nuevo Empleado</h2>
      </div>
      <form onSubmit={handleFormSubmit} className="mt-16 max-w-xl sm:mt-20">
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
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
              {errors.secondLastName && <p className="text-red-500 text-sm mt-1">{errors.secondLastName}</p>}
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
              {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

                    <div className="">
            <label htmlFor="alta" className="block text-sm font-semibold text-gray-900">
              Fecha de Alta
            </label>
            <div className="mt-2.5">
              <input
                id="alta"
                name="alta"
                type="date"
                autoComplete="alta"
                value={formData.fechaAlta}
                onChange={(e) => setFormData({ ...formData, fechaAlta: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

          </div>
                    <div className="">
            <label htmlFor="baja" className="block text-sm font-semibold text-gray-900">
              Fecha de Baja
            </label>
            <div className="mt-2.5">
              <input
                id="baja"
                name="baja"
                type="date"
                autoComplete="baja"
                value={formData.fechaBaja}
                onChange={(e) => setFormData({ ...formData, fechaBaja: e.target.value })}
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            {editedEmployee ? 'Actualizar Empleado' : 'Registrar Empleado'}
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
      <ConfirmModal
        isOpen={showConfirmModal}
        message="¿Estás seguro de que deseas guardar este empleado?"
        onConfirm={submitForm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}

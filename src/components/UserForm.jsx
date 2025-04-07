'use client'

import { useState } from 'react'
import { Tabla } from './Tabla'

export default function UserForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', secondLastName: '', email: '', dni: '', password: '', accesLevel: '' })


  const handleSubmit = (e) => {

    e.preventDefault() // evita recargar la página
    console.log(formData)
  }
  

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Registrar Nuevo Usuario</h2>
        <p className="mt-2 text-lg text-gray-600">Completar todos los campos</p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
              Nombre
            </label>
            <div className="mt-2.5">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
            <label htmlFor="accesLevel" className="block text-sm font-semibold text-gray-900">
              Nivel de Acceso
            </label>
            <div className="mt-2.5">
              <input
                id="accesLevel"
                name="accesLevel"
                type="number"
                autoComplete="accesLevel"
                value={formData.accesLevel}
                onChange={(e) => setFormData({ ...formData, accesLevel: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3.5 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            
          </div>
        
 

        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Guardar
          </button>
        </div>
      </form>

      <Tabla/>
    </div>
  )
}

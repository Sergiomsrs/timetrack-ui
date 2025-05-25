import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { saludo } from '../utilities/timeManagement';


export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/'); // Redirigir a la página de login después de cerrar sesión
  };

  return (
    <header className="bg-[#f9fafb]  border-gray-200 shadow-sm mb-8">
      <nav className="flex  items-center justify-between p-4 mx-6" aria-label="Global">

      <div className='w-1/4'>
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/Logo.svg" alt="Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-violet-700">TimeTrack</span>
          </Link>
        </div>

      </div>

       <div className='w-2/4 flex justify-center'>

        {/* Navbar pantalla completa */}
        {auth.isAuthenticated && (
          // Visible para todos los usuarios autenticados
          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition">Inicio</Link>
            {/*Visible solo para administradores*/}
            {auth.role === 'ADMIN' && (
              <Link to="/usuarios" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition">Empleados</Link>
            )}
            <Link to="/fichajes" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition">Registros</Link>
            {/*Visible solo para administradores*/}
            {auth.role === 'ADMIN' && (
              <Link to="/log" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition">Notificaciones</Link>
            )}
          </div>
        )}

      </div>

       <div className='w-1/4 flex justify-end'>
        <div className="hidden lg:flex items-center gap-x-4">
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm text-gray-700 font-bold bg-gray-200 px-3 py-1 rounded">
                <strong>{saludo()},</strong> {auth.user?.name} 
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded transition"
              >
                Log out
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-current"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M9 12h12l-3 -3" />
                  <path d="M18 15l3 -3" />
                </svg>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded transition"
            >
              Log in
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-current"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M21 12h-13l3 -3" />
                <path d="M11 15l-3 -3" />
              </svg>
            </Link>

          )}
        </div>

      </div>





        {/* Botón del menú hamburguesa en móviles */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 text-violet-700 rounded hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

       

       
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-4 space-y-4 z-50">
          <Link to="/" className="block text-base font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Inicio</Link>
          {auth.role === 'ADMIN' && (
            <>
            <Link to="/usuarios" className="block text-base font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Empleados</Link>
          <Link to="/fichajes" className="block text-base font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Registros</Link>
            </>
          )}
          {auth.role === 'ADMIN' && (
            <Link to="/log" className="block text-base font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Notificaciones</Link>
          )}
          {auth.isAuthenticated ? (
            <>
              <span className="block text-base text-gray-700">{saludo()}, {auth.user?.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-base font-medium text-violet-700 hover:underline"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="block text-base font-medium text-violet-700" onClick={() => setMenuOpen(false)}>Log in</Link>
          )}
        </div>
      )}
    </header>
  );
};
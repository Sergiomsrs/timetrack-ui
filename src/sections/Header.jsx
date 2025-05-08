import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext ';


export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a la página de login después de cerrar sesión
  };
  console.log(auth);
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-12 w-auto" src="/Logo.svg" alt="Logo" /> {/* Asegúrate de que la ruta sea correcta */}
          </Link>
        </div>

        {/* Botón del menú hamburguesa en móviles */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Menú en pantallas grandes */}
        {auth.isAuthenticated &&
        <div className="hidden lg:flex lg:gap-x-12">
          <>
          <Link to="/" className="text-sm font-semibold text-gray-900">Inicio</Link>
          {auth.role == "ADMIN" && <Link to="/usuarios" className="text-sm font-semibold text-gray-900">Usuarios</Link>}
          <Link to="/fichajes" className="text-sm font-semibold text-gray-900">Registros</Link>
          </>
        </div>
          }

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-4">
          {auth.isAuthenticated ? (
            <>
              <span className="text-sm font-semibold text-gray-900">
                Bienvenido, {auth.user && auth.user.name} {/* Ajusta 'name' según la estructura de tu objeto usuario */}
              </span>
              <button onClick={handleLogout} className="text-sm font-semibold text-gray-900">
                Log out <span aria-hidden="true">&rarr;</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 z-10 w-full bg-white p-6 shadow-md">
          <button className="absolute top-4 right-4" onClick={() => setMenuOpen(false)}>
            <span className="sr-only">Close menu</span>
            ✖
          </button>
          <nav className="mt-6 space-y-4">
            <Link to="/" className="block text-lg font-semibold text-gray-900">Inicio</Link>
            <Link to="/usuarios" className="block text-lg font-semibold text-gray-900">Usuarios</Link>
            <Link to="/fichajes" className="block text-lg font-semibold text-gray-900">Registros</Link>
            {auth.isAuthenticated ? (
              <>
                <span className="block text-lg font-semibold text-gray-900">
                  Bienvenido, {auth.user && auth.name} 
                </span>
                <button onClick={handleLogout} className="block text-lg font-semibold text-gray-900 cursor-pointer">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-lg font-semibold text-gray-900">
                Log in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
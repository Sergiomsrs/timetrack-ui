import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertMessage } from '../components/AlertMessage';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({text: '', type: ''});

  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Se hace la peticion de login con los datos del formulario
    try {
      const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) throw new Error('Error al iniciar sesión');

      const loginData = await loginResponse.json();
      const token = loginData.token;
      const role = loginData.role; // Se obtiene el role de la primera respuesta
      // Si el login es exitoso, se hace una peticion para obtener los datos del usuario
      const meResponse = await fetch('http://localhost:8080/api/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!meResponse.ok) throw new Error('Error al obtener datos del usuario');

      const userData = await meResponse.json();
      // Se pasan los datos obtenidos a la funcion login del contexto
      login(token, role, userData); // Se pasa el token, el role y los datos del usuario
      navigate("/fichajes")      
      setFormData({ dni: '', password: '' });

    } catch (error) {
      setError(true);

      let err = error.message === 'Failed to fetch' ? 'Error de conexión' : error.message;
      setErrorMessage({
        text: err,
        type: 'error'
      });
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
<div className="flex  items-center justify-center bg-gradient-to-br mt-36 px-4">
  <div className="w-full max-w-sm rounded-2xl shadow-2xl p-8">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
      Acceso al sistema
    </h2>
    <p className="mb-4 text-lg text-gray-600 text-center">Introduce tus credenciales</p>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
          DNI
        </label>
        <input
          onChange={handleInputChange}
          value={formData.dni}
          type="text"
          name="dni"
          id="dni"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          onChange={handleInputChange}
          value={formData.password}
          type="password"
          name="password"
          id="password"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white bg-violet-600 hover:bg-violet-700 font-medium py-2 rounded-md transition"
      >
        Iniciar sesión
      </button>
    </form>

    {error && (
      <div className="mt-5">
        <AlertMessage isOpen={error} message={errorMessage} />
      </div>
    )}
  </div>
</div>

  );
};

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
    try {
      const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) throw new Error('Error al iniciar sesión');

      const loginData = await loginResponse.json();
      const token = loginData.token;
      const role = loginData.role; // <---- Obtenemos el role de la primera respuesta

      const meResponse = await fetch('http://localhost:8080/api/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!meResponse.ok) throw new Error('Error al obtener datos del usuario');

      const userData = await meResponse.json();

      login(token, role, userData); // <---- Pasamos el token, el role y los datos del usuario
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Inicia sesión
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-900">DNI</label>
            <div className="mt-2">
              <input
                onChange={handleInputChange}
                value={formData.dni}
                type="text"
                name="dni"
                id="dni"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Contraseña</label>
            <div className="mt-2">
              <input
                onChange={handleInputChange}
                value={formData.password}
                type="password"
                name="password"
                id="password"
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
      {error && (
        <div className="mt-4 text-red-600 flex justify-center">
          <AlertMessage isOpen={error} message={errorMessage} />
        </div>
      )}
    </div>
  );
};

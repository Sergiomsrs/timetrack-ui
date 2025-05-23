import { createContext, useState } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const user = sessionStorage.getItem('user');

    if (token && user && user !== "undefined") {
      try {
        return {
          isAuthenticated: true,
          token,
          role,
          user: JSON.parse(user),
        };
      } catch (error) {
        console.error("Error al parsear el usuario:", error);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
      }
    }

    return {
      isAuthenticated: false,
      token: null,
      user: null,
      role: null,
    };
  });


  const login = (token, role, user) => {
    if (!token || !user) {
      console.error("Intento de login con datos incompletos:", { token, role, user });
      return;
    }

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('user', JSON.stringify(user));
    setAuth({
      isAuthenticated: true,
      token,
      role,
      user,
    });


  };


  const logout = () => {
    sessionStorage.clear();
    setAuth({
      isAuthenticated: false,
      token: null,
      role: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

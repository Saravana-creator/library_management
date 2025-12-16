import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [librarian, setLibrarian] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedLibrarian = localStorage.getItem('librarian');

    if (storedToken && storedLibrarian) {
      setToken(storedToken);
      setLibrarian(JSON.parse(storedLibrarian));
    }
    setLoading(false);
  }, []);

  const login = (token, librarianData) => {
    console.log('Login called with:', { token, librarianData });
    localStorage.setItem('token', token);
    localStorage.setItem('librarian', JSON.stringify(librarianData));
    setToken(token);
    setLibrarian(librarianData);
    console.log('Login state updated');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('librarian');
    setToken(null);
    setLibrarian(null);
  };

  const value = {
    librarian,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
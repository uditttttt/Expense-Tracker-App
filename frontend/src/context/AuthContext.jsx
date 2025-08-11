import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs when the app loads to check if a user is already logged in.
    async function loadUserFromToken() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Set the token in the default headers for all future api requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch user data with the token
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Failed to load user from token', error);
          // If token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    }

    loadUserFromToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}> {/* Add setUser here */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

/*

## Core Concept: React Context API
Think of the Context API as a global announcement system for your app. Instead of passing user information down through many layers of components (called "prop drilling"), we can create a central "AuthContext" that holds the user's status. Any component that needs this information can simply subscribe to it.

Code Breakdown:

useEffect: This is the most important part. When our app first loads, this code checks localStorage for a token. If it finds one, it automatically sets it as the authorization header for axios and makes a call to our /api/auth/me endpoint to get the user's data. This is how your app "remembers" you when you refresh the page.

logout: This function clears the user's session by removing the token and user data.

AuthContext.Provider: This component makes the user, loading, and logout values available to every other component wrapped inside it.

*/
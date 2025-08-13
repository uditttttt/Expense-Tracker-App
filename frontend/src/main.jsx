import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with the provider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

/*
Line 9: <AuthProvider> ..... </AuthProvider>
What it does: This line wraps your entire <App /> component with the AuthProvider.

Why it's used: This is the crucial step that activates your "school announcement system" for the entire "school" (<App /> and all its children). By doing this, every single component inside <App /> can now access the shared authentication context (the user data, the loading state, and the logout function).

*/

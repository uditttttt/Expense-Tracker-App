import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // We show a loading message while the user's status is being checked.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If loading is finished and a user exists, show the requested page.
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

/*

Code Breakdown:

useContext(AuthContext): This hook subscribes to our AuthContext and gets the current user and loading status.

<Outlet />: This component from React Router renders the actual page the user was trying to access (e.g., the Dashboard).

<Navigate to="/login" />: This component redirects the user to the login page if they are not authenticated.

*/
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

This component acts as a "gatekeeper" for your private pages. It uses the global information from your AuthContext to decide whether to let a user see a page or to redirect them to the login screen.

Code Breakdown:

useContext(AuthContext): This hook subscribes to our AuthContext and gets the current user and loading status.

<Outlet />: This component from React Router renders the actual page the user was trying to access (e.g., the Dashboard).

<Navigate to="/login" />: This component redirects the user to the login page if they are not authenticated.


Imports
Line 1: import { useContext } from 'react';
What it does: Imports the useContext hook from React.

Why it's used: This is the standard hook for a component to consume or "listen to" a context. This is how your "classroom" tunes into the "school announcement system."

Line 2: import { Navigate, Outlet } from 'react-router-dom';
What it does: Imports two special components from react-router-dom.

Outlet: This component is a placeholder. It's used within a parent route's element to render its child route's element. We'll see how this works below.

Maps: This is a component that, when rendered, redirects the user to a different route.

Why it's used: These are the tools needed to either show the protected content (Outlet) or kick the user out (Maps).

Line 3: import AuthContext from '../context/AuthContext';
What it does: Imports the AuthContext object (the "announcement system" itself).

Why it's used: To pass it to the useContext hook so this component knows which specific context to listen to.

The ProtectedRoute Component
Line 6: const { user, loading } = useContext(AuthContext);
What it does: This is where the magic happens.

useContext(AuthContext) tells this component to connect to the AuthContext and listen for the values it's providing.

const { user, loading } = ... then uses destructuring to pull the user and loading values out of that context.

Why it's used: This gives the ProtectedRoute direct access to the global authentication state without needing any props passed down to it. It instantly knows if a user is logged in and if the initial authentication check is still running.

Lines 9-11: if (loading) { ... }
What it does: It checks if the loading state from AuthContext is still true. If it is, it returns a simple <div>Loading...</div>.

Why it's used: This is a crucial step to prevent a "redirect flash." When a logged-in user refreshes a protected page, there's a tiny delay while the AuthProvider checks the token in localStorage. During this delay, user is null. Without this check, the component would see user as null and instantly redirect to /login, only to be redirected back once the user is loaded. This loading check makes the component wait until the authentication status is confirmed.

Line 15: return user ? <Outlet /> : <Navigate to="/login" replace />;
What it does: This is a ternary operator that acts as the main logic gate. It runs only after loading is false. It reads: "If user exists, render <Outlet />. Otherwise, render <Navigate />."

Why it's used: This is the core decision-making of the component.

Let's break down the two outcomes:

user ? <Outlet /> (The "Access Granted" Path)

If a user object exists (meaning they are logged in), this component renders the <Outlet />.

What is <Outlet />? It's a placeholder that says, "Render whatever child route is matched here." In your main App.js, you'll set up your routes like this:

JavaScript

<Route element={<ProtectedRoute />}>
  <Route path="/" element={<DashboardPage />} />
</Route>
The <Outlet /> in ProtectedRoute is the exact spot where <DashboardPage /> will be rendered.

: <Navigate to="/login" replace /> (The "Access Denied" Path)

If user is null (meaning they are not logged in), this component renders the <Navigate /> component.

to="/login": This prop tells the component to redirect the user to the /login page.

replace: This is an important prop. It tells the router to replace the current entry in the browser's history instead of adding a new one. This prevents the user from clicking the "back" button to get back to the protected page they were just redirected from.
*/
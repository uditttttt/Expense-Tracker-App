import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard
import Layout from './components/Layout'; // Import the new Layout



function App() {
  return (
    <Router>
      {/* We removed the main div from here since the Layout handles it */}
      <Routes>
        {/* Public Routes remain outside the layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes are now wrapped by the Layout */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

/*

Code Breakdown:

BrowserRouter as Router: This component wraps our app and enables URL-based navigation.

Routes: This is a container for all of our specific routes.

Route: Each Route component maps a URL path to a specific React element (one of our pages). When the URL matches the path, the corresponding element is rendered.

---------------------------------------------------------

ine 5: import ProtectedRoute from './components/ProtectedRoute';
What it does: Imports your "gatekeeper" component.

Why it's used: To make the ProtectedRoute component available so you can use it to guard your private pages.

Lines 13-14: Public Routes
JavaScript

<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
What they do: These are your public routes. They are defined directly under <Routes>.

Why they're used: Anyone, whether they are logged in or not, can access these pages. This is necessary so new users can register and existing users can log in.

Line 17: <Route element={<ProtectedRoute />}>
What it does: This is the most important new line. This <Route> acts as a parent or a layout route.

It doesn't have a path prop.

Instead, it has an element prop, which is set to your <ProtectedRoute /> component.

Why it's used: This is the modern way to handle protected routes in react-router-dom v6. It tells the router: "For any route that is nested inside me as a child, you must first render the <ProtectedRoute /> component." This effectively puts your "gatekeeper" in front of a whole group of pages.

Line 19: <Route path="/" element={<DashboardPage />} />
What it does: This is a child route, nested inside the parent ProtectedRoute route. It defines the route for your home page (/), which renders the DashboardPage.

Why it's used: This is the page you want to protect. Because it's a child of the ProtectedRoute layout, it can only be accessed if the parent allows it.

The Complete Workflow
Here is how React Router processes a request to your home page (/) with this new setup:

A user tries to go to http://yourapp.com/.

React Router looks for a matching path. It finds the child route path="/".

Before rendering <DashboardPage />, it sees that this route is nested inside a parent route: <Route element={<ProtectedRoute />}>.

So, it first renders the <ProtectedRoute /> component.

The ProtectedRoute component then runs its logic:

It checks the AuthContext for the user and loading state.

It waits until loading is false.

Now, one of two things happens:

Access Granted: If user exists (they are logged in), ProtectedRoute returns <Outlet />. The <Outlet /> component acts as a placeholder that says, "Render the matched child route here." In this case, <DashboardPage /> is rendered inside the Outlet. The user sees their dashboard.

Access Denied: If user is null (they are not logged in), ProtectedRoute returns <Navigate to="/login" />. The user is immediately redirected to the login page and never gets to see the dashboard.

This structure is incredibly powerful because you can now add more protected pages easily just by placing them as children of the ProtectedRoute route:
*/
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* The Dashboard will be our home page */}
            <Route path="/" element={<DashboardPage />} />
            {/* You can add more protected pages here in the future */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*

Code Breakdown:

BrowserRouter as Router: This component wraps our app and enables URL-based navigation.

Routes: This is a container for all of our specific routes.

Route: Each Route component maps a URL path to a specific React element (one of our pages). When the URL matches the path, the corresponding element is rendered.

*/
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Outlet /> {/* Our page content (e.g., DashboardPage) will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/posts">Posts</NavLink>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

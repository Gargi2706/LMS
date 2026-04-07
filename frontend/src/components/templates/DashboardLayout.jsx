import Sidebar from "../organisms/Sidebar";

const DashboardLayout = ({ children, title }) => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="main-content">
      {title && (
        <div className="topbar">
          <h1 className="topbar-title">{title}</h1>
        </div>
      )}
      {children}
    </main>
  </div>
);

export default DashboardLayout;

import { useState, useRef, useEffect } from "react";
import Sidebar from "../organisms/Sidebar";

const DashboardLayout = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const topbarLogoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        topbarLogoRef.current &&
        !topbarLogoRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        sidebarRef={sidebarRef} 
        onLogoClick={toggleSidebar} 
      />
      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="topbar">
          <div className="d-flex align-items-center">
            {/* Topbar Logo - acts as toggle when sidebar is closed */}
            <div 
              ref={topbarLogoRef}
              className="sidebar-logo-container me-4 mb-0" 
              onClick={toggleSidebar}
              style={{ 
                cursor: "pointer", 
                opacity: isSidebarOpen ? 0 : 1, 
                transition: "opacity 0.2s",
                paddingLeft: 0,
                pointerEvents: isSidebarOpen ? 'none' : 'auto'
              }}
            >
              <img src="/logo.svg" alt="EduFlow" className="sidebar-logo-img" />
              <div className="sidebar-logo">EduFlow</div>
            </div>
            {title && <h1 className="topbar-title mb-0">{title}</h1>}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

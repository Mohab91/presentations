// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* زر القائمة الجانبية */}
      <button onClick={toggleSidebar} className="toggle-sidebar-btn">
        ☰
      </button>

      {/* الشريط الجانبي */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="text-lg font-bold mb-3">📊 منصة العروض</h2>
        <Link to="/dashboard" onClick={() => setSidebarOpen(false)}>الرئيسية</Link>
        <Link to="/presentations" onClick={() => setSidebarOpen(false)}>العروض</Link>
        {(role === "admin" || role === "lecturer") && (
          <Link to="/upload" onClick={() => setSidebarOpen(false)}>رفع عرض</Link>
        )}
        {role === "admin" && (
          <Link to="/manage-users" onClick={() => setSidebarOpen(false)}>إدارة المستخدمين</Link>
        )}
        <button onClick={handleLogout} className="logout-btn">تسجيل الخروج</button>
      </div>
    </>
  );
}
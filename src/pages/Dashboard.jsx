// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import './dashboard.css';
import { FaChartBar, FaCloudUploadAlt, FaUsersCog } from "react-icons/fa";

export default function Dashboard({ user, role }) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 p-6 text-right">
      <div className="max-w-7xl mx-auto">

        {/* الشعار والعنوان — ملتصقين تمامًا */}
        <div className="flex justify-center items-center mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-blue-900 bg-white/30 px-4 py-2 rounded-xl shadow flex items-center gap-2">
            <img
              src="/logo.png"
              alt="شعار النيابة العامة"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "white",
                padding: "2px",
                borderRadius: "50%",
              }}
              className="shadow object-contain"
            />
            منصة العروض
          </h1>
        </div>

        {/* شبكة الكروت */}
        <div className="dashboard-grid">
          {/* استعراض العروض */}
          <div className="dashboard-card">
            <FaChartBar className="icon" />
            <div>
              <h3>استعراض العروض</h3>
              <p>تصفح العروض حسب الموضوعات المختلفة.</p>
              <Link to="/presentations" className="btn-primary">الانتقال إلى العروض</Link>
            </div>
          </div>

          {/* رفع عرض جديد */}
          <div className="dashboard-card">
            <FaCloudUploadAlt className="icon" />
            <div>
              <h3>رفع عرض جديد</h3>
              <p>ارفع PowerPoint أو PDF واختر الموضوع المناسب.</p>
              <Link to="/upload" className="btn-primary">رفع عرض الآن</Link>
            </div>
          </div>

          {/* إدارة المستخدمين */}
          {role === "admin" && (
            <div className="dashboard-card">
              <FaUsersCog className="icon" />
              <div>
                <h3>إدارة المستخدمين</h3>
                <p>تعديل الصلاحيات وتعيين المحاضرين والإداريين.</p>
                <Link to="/manage-users" className="btn-primary">إدارة المستخدمين</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
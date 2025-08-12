import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-900 text-white py-3 px-6 flex justify-between items-center text-sm md:text-base">
      <div className="font-bold text-lg">📊 منصة العروض</div>

      <ul className="flex gap-4 items-center">
        <li>
          <Link to="/dashboard" className="hover:underline">
            الرئيسية
          </Link>
        </li>

        <li>
          <Link to="/presentations" className="hover:underline">
            العروض
          </Link>
        </li>

        {(role === "admin" || role === "lecturer") && (
          <li>
            <Link to="/upload" className="hover:underline">
              رفع عرض
            </Link>
          </li>
        )}

        {role === "admin" && (
          <li>
            <Link to="/manage-users" className="hover:underline">
              إدارة المستخدمين
            </Link>
          </li>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
          >
            تسجيل الخروج
          </button>
        </li>
      </ul>
    </nav>
  );
}
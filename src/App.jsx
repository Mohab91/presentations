import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import PresentationsPage from "./pages/PresentationsPage";
import ManageUsers from "./pages/ManageUsers";
import Navbar from "./components/Navbar";
import AuthCallback from "./pages/AuthCallback";
import LoginWithGoogle from "./pages/LoginWithGoogle"; // إذا كنت تستخدمها فعلاً

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            setRole(userRole);
            console.log("المستخدم الحالي:", user.email);
            console.log("الدور:", userRole);
          } else {
            console.warn("لم يتم العثور على وثيقة المستخدم.");
          }
        } catch (error) {
          console.error("حدث خطأ أثناء جلب الدور:", error);
        }
      } else {
        setUser(null);
        setRole(null);
        // ✅ السماح لبعض المسارات بدون تسجيل الدخول
        const publicPaths = ["/", "/login", "/signup", "/auth/callback", "/login-with-google"];
        if (!publicPaths.includes(location.pathname)) {
          navigate("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  if (loading) return <p className="text-center mt-20">جاري التحميل...</p>;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {user && role && <Navbar user={user} role={role} />}
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          {/* ✅ إعادة توجيه / إلى /dashboard أو /login */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login-with-google" element={<LoginWithGoogle />} />
          <Route path="/auth/callback" element={<AuthCallback setToken={() => {}} />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} role={role} /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={user ? <Upload user={user} role={role} /> : <Navigate to="/login" />}
          />
          <Route
            path="/presentations"
            element={user ? <PresentationsPage user={user} role={role} /> : <Navigate to="/login" />}
          />
          <Route
            path="/manage-users"
            element={user ? <ManageUsers user={user} role={role} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}
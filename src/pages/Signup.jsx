// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ✅ الدور المسموح به فقط: viewer أو lecturer
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const allowedRoles = ["viewer", "lecturer"]; // ⬅️ لا شيء غيرهم

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      // حراسة إضافية: لو حد حاول يغيّر القيمة يدويًا
      const safeRole = allowedRoles.includes(role) ? role : "viewer";

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email: email.trim(),
        role: safeRole,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      setErr(e.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100 flex items-start pt-12">
      <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur rounded-2xl shadow p-6">
        <h1 className="text-center text-2xl font-extrabold text-blue-900 mb-6">
          تسجيل حساب جديد
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            required
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* ✅ قائمة أدوار محدودة: مشاهد أو محاضر فقط */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="viewer">مشاهد (Viewer)</option>
            <option value="lecturer">محاضر (Lecturer)</option>
          </select>

          {err && (
            <p className="text-red-600 text-sm text-center">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
          >
            {loading ? "جاري التسجيل..." : "تسجيل حساب"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
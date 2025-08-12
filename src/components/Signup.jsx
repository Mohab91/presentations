import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      navigate("/login");
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء التسجيل. تأكد من صحة البيانات.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          تسجيل مستخدم جديد
        </h2>

        {errorMsg && (
          <p className="text-red-600 mb-4 text-sm text-center">{errorMsg}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2 text-right"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">كلمة المرور</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2 text-right"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm">نوع المستخدم</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-right"
          >
            <option value="viewer">مشاهد</option>
            <option value="lecturer">محاضر</option>
            <option value="admin">مدير</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          إنشاء الحساب
        </button>
      </form>
    </div>
  );
}
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer"); // 💡 القيمة الافتراضية
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("تم تسجيل المستخدم:", user.uid);

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // ✅ استخدم الدور المختار من القائمة
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء الحساب:", error.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto p-4 bg-white rounded shadow mt-10 space-y-4">
      <h2 className="text-xl font-bold text-center">تسجيل حساب جديد</h2>

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        className="w-full border p-2 rounded"
      />

      {/* ✅ قائمة اختيار الدور */}
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="viewer">مشاهد (Viewer)</option>
        <option value="lecturer">محاضر (Lecturer)</option>
        <option value="admin">مدير (Admin)</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        تسجيل حساب
      </button>
    </form>
  );
}
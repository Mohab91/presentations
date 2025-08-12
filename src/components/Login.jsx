import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // إعادة التوجيه للصفحة الرئيسية بعد تسجيل الدخول
    } catch (err) {
      setErrorMsg("بيانات الدخول غير صحيحة أو حدث خطأ في الاتصال.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          تسجيل الدخول
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

        <div className="mb-6">
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

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("فشل تسجيل الدخول: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md shadow-lg p-8 rounded-xl w-full max-w-md space-y-6 animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">تسجيل الدخول</h2>

        <div className="flex flex-col space-y-2 text-right">
          <label htmlFor="email" className="font-medium text-gray-700">البريد الإلكتروني</label>
          <input
            id="email"
            type="email"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2 text-right">
          <label htmlFor="password" className="font-medium text-gray-700">كلمة المرور</label>
          <input
            id="password"
            type="password"
            className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
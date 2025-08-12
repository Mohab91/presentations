import { useEffect } from "react";

export default function LoginWithGoogle() {
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "https://www.googleapis.com/auth/drive.file";

    // 🔧 هنا الإضافة الهامة: prompt=select_account
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}&include_granted_scopes=true&prompt=select_account`;

    window.location.href = authUrl;
  };

  return (
    <div className="text-center mt-10">
      <h2 className="mb-4 text-lg font-bold text-gray-800">🔐 تسجيل الدخول بحساب Google</h2>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        تسجيل الدخول باستخدام Google
      </button>
    </div>
  );
}
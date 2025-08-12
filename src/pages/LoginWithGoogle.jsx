// src/pages/LoginWithGoogle.jsx
export default function LoginWithGoogle() {
  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;

    // ✅ أضف صلاحية قراءة البريد الإلكتروني
    const scope = [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.email"
    ].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scope
    )}&prompt=select_account`;

    window.location.href = authUrl;
  };

  return (
    <div className="text-center mt-20">
      <h2 className="text-lg mb-4 font-bold">🔐 تسجيل الدخول باستخدام Google</h2>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        تسجيل الدخول باستخدام Google
      </button>
    </div>
  );
}
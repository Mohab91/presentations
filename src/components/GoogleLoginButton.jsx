// src/components/GoogleLoginButton.jsx
import { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID =
  "556590278661-is9qkj1rnko9rc9f1jtvcns6rhtuftdg.apps.googleusercontent.com";

export default function GoogleLoginButton({ onLogin }) {
  useEffect(() => {
    function start() {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = async () => {
    const auth2 = gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().access_token;

      // إرسال البيانات إلى المكون الأب أو الحفظ
      onLogin({
        name: profile.getName(),
        email: profile.getEmail(),
        token,
      });
    } catch (err) {
      console.error("فشل تسجيل الدخول إلى Google", err);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      تسجيل الدخول باستخدام Google
    </button>
  );
}
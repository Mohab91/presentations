import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");

    if (token) {
      localStorage.setItem("google_access_token", token);

      // 👇 جلب معلومات المستخدم للحصول على الإيميل
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            localStorage.setItem("google_email", data.email);
          }
          navigate("/upload");
        })
        .catch((err) => {
          console.error("❌ فشل في جلب البريد الإلكتروني:", err);
          navigate("/upload");
        });
    } else {
      alert("❌ فشل تسجيل الدخول، لم يتم العثور على access_token.");
      navigate("/login-with-google");
    }
  }, []);

  return (
    <div className="text-center mt-20">
      <p>🔄 جاري تسجيل الدخول...</p>
    </div>
  );
}
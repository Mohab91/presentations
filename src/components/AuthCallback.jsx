import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("google_token", accessToken);
      navigate("/upload");
    } else {
      alert("فشل تسجيل الدخول.");
      navigate("/");
    }
  }, [navigate]);

  return <p className="text-center mt-10">...جاري تسجيل الدخول</p>;
}
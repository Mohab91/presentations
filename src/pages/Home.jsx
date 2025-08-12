// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import PresentationsList from "../components/PresentationsList";
import UploadPresentation from "../components/UploadPresentation";

export default function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      const fetchRole = async () => {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        } else {
          setRole("viewer"); // الدور الافتراضي
        }
        setLoading(false);
      };

      fetchRole();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="p-6 text-center">⏳ جارٍ التحميل...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 text-blue-900 text-right">
        🎓 منصة العروض التقديمية القضائية
      </h1>

      {/* 👤 مرحبًا بالمستخدم */}
      {user && (
        <p className="text-sm text-right mb-4 text-gray-700">
          مرحبًا، {user.email} - الصلاحية: {role}
        </p>
      )}

      {/* ✏️ مكون الرفع (للمحاضر والمدير فقط) */}
      <UploadPresentation user={user} role={role} />

      {/* 📚 مكون عرض العروض */}
      <PresentationsList user={user} role={role} />
    </div>
  );
}
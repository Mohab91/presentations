import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UploadPresentation from "./UploadPresentation";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function MainContent({ selectedTopic, role }) {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresentations = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "presentations"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPresentations(data);
      setLoading(false);
    };

    fetchPresentations();
  }, []);

  const filtered = selectedTopic === "جميع العروض"
    ? presentations
    : presentations.filter((p) => p.topic === selectedTopic);

  return (
    <div className="p-6 text-right">
      <UploadPresentation
        role={role}
        user={{ email: "placeholder@example.com" }} // استبدله لاحقًا بـ user.email من useAuthUser
      />

      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        {selectedTopic === "جميع العروض"
          ? "كل المواضيع"
          : `📘 الموضوع: ${selectedTopic}`}
      </h2>

      {loading ? (
        <p className="text-gray-500">جاري تحميل العروض...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          لا توجد عروض مضافة لهذا الموضوع.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pres) => (
            <div
              key={pres.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex items-center space-x-4 space-x-reverse"
            >
              <div className="bg-blue-100 p-4 rounded-full">
                <HiOutlineDocumentText className="text-blue-600 text-3xl" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-lg text-gray-800">
                  {pres.title}
                </h3>
                <p className="text-sm text-gray-500">{pres.topic}</p>
                <a
                  href={pres.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm underline mt-1"
                >
                  عرض العرض
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
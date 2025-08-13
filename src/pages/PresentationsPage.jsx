import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import topics from "../data/topics";

export default function PresentationsList({ role }) {
  const [presentations, setPresentations] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "presentations"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPresentations(data);
      } catch (error) {
        console.error("خطأ في تحميل العروض:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = presentations.filter((p) => {
    const matchesTopic = selectedTopic ? p.topic === selectedTopic : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* العنوان */}
        <h1 className="text-3xl font-extrabold text-center text-blue-900">
          📂 قائمة العروض التقديمية
        </h1>

        {/* الفلاتر */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <select
            className="border border-blue-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">عرض الكل</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 اكتب كلمة للبحث..."
            className="border border-blue-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* عرض البيانات */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">⏳ جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد عروض مطابقة.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-5 border border-gray-100"
              >
                <h3 className="text-xl font-bold text-blue-800 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-4">🗂 {p.topic}</p>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  عرض الملف ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

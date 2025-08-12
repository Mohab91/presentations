import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import topics from "../data/topics";

export default function PresentationsList({ role }) {
  const [presentations, setPresentations] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "presentations"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPresentations(data);
    };
    fetchData();
  }, []);

  const filtered = presentations.filter((p) => {
    const matchesTopic = selectedTopic ? p.topic === selectedTopic : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <label className="block mb-2 font-medium text-blue-900">
          🔎 اختر موضوعًا لعرض العروض:
        </label>
        <select
          className="border p-2 rounded w-full max-w-sm"
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
      </div>

      <div className="mt-4">
        <label className="block mb-2 font-medium text-blue-900">
          🔍 بحث داخل العناوين:
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="اكتب كلمة للبحث..."
          className="border p-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center">لا توجد عروض مطابقة.</p>
      ) : (
        <div className="presentation-grid">
          {filtered.map((p) => (
            <div key={p.id} className="presentation-card">
              <h3>{p.title}</h3>
              <p>🗂 الموضوع: {p.topic}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline text-sm font-medium"
              >
                عرض الملف ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
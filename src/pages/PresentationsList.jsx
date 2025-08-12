import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import topics from "../data/topics";

export default function PresentationsList({ role }) {
  const [presentations, setPresentations] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "presentations"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPresentations(data);
    };
    fetchData();
  }, []);

  const filtered = selectedTopic
    ? presentations.filter((p) => p.topic === selectedTopic)
    : presentations;

  return (
    <div className="space-y-8 px-4">
      <div className="max-w-xl mx-auto text-center">
        <label className="block mb-2 font-semibold text-lg">🔎 اختر موضوعًا لعرض العروض:</label>
        <select
          className="border p-3 rounded w-full text-center"
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

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center">لا توجد عروض مطابقة.</p>
      ) : (
        <div className="presentation-grid">
          {filtered.map((p) => (
            <div key={p.id} className="presentation-card">
              <h3>{p.title}</h3>
              <p>📚 الموضوع: {p.topic}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
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
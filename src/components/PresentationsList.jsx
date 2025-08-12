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
    <div className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">🔎 اختر موضوعًا لعرض العروض:</label>
        <select
          className="border p-2 rounded w-full"
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
        <p className="text-gray-500">لا توجد عروض مطابقة.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((p) => (
            <li key={p.id} className="p-4 bg-white shadow rounded border text-right">
              <p className="text-lg font-semibold text-blue-800">{p.title}</p>
              <p className="text-sm text-gray-600 mb-1">🗂 الموضوع: {p.topic}</p>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                عرض الملف ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
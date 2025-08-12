import topics from "../data/topics";
import { HiOutlineFolderOpen } from "react-icons/hi";

export default function Sidebar({ setSelectedTopic, role }) {
  return (
    <div className="w-72 bg-blue-900 text-white p-6 shadow-lg h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center justify-end gap-2">
        <span>المواضيع</span>
        <HiOutlineFolderOpen className="text-2xl" />
      </h2>
      <ul className="space-y-2 text-right text-sm">
        <li
          className="cursor-pointer hover:bg-blue-700 p-3 rounded"
          onClick={() => setSelectedTopic("جميع العروض")}
        >
          جميع العروض
        </li>
        {topics.map((topic) => (
          <li
            key={topic}
            className="cursor-pointer hover:bg-blue-700 p-3 rounded"
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}
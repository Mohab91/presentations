import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import topics from "../data/topics";
import { gapi } from "gapi-script";
import { motion } from "framer-motion";
import { UploadCloud, Loader2 } from "lucide-react";

export default function UploadPresentation({ user, role }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [topic, setTopic] = useState(topics[0]);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (role !== "admin" && role !== "lecturer") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setUploading(true);

    try {
      if (!file) {
        alert("من فضلك اختر ملف PowerPoint أولاً");
        setUploading(false);
        return;
      }

      const accessToken = gapi.auth.getToken().access_token;
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + accessToken }),
          body: form,
        }
      );

      const result = await response.json();
      const fileId = result.id;
      const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

      await addDoc(collection(db, "presentations"), {
        title,
        link: fileLink,
        topic,
        createdBy: user.email,
        createdAt: Timestamp.now(),
      });

      setTitle("");
      setFile(null);
      setTopic(topics[0]);
      setSuccess(true);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("حدث خطأ أثناء رفع العرض.");
    }

    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-2xl p-6 mb-8 border border-blue-100 text-right"
    >
      <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center justify-end gap-2">
        <UploadCloud size={22} /> رفع عرض جديد
      </h3>

      {success && (
        <div className="text-green-600 text-sm mb-4">
          ✅ تم رفع العرض بنجاح
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-semibold">عنوان العرض</label>
          <input
            type="text"
            className="w-full border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">اختر ملف العرض</label>
          <input
            type="file"
            className="w-full border border-blue-200 p-2 rounded-lg file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"
            accept=".ppt,.pptx,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">الموضوع</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-blue-200 p-2 rounded-lg"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-700 text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              جاري الرفع...
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              رفع العرض
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
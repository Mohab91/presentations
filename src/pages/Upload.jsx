import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import topics from "../data/topics";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("google_access_token");
    const email = localStorage.getItem("google_email");
    if (accessToken) {
      setToken(accessToken);
    }
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleTopicChange = (e) => setSelectedTopic(e.target.value);

  const createFolderIfNotExists = async (folderName) => {
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    const res = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.folder' and name='" + folderName + "'", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const existing = await res.json();
    if (existing.files && existing.files.length > 0) {
      return existing.files[0].id;
    }

    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderMetadata),
    });

    const created = await createRes.json();
    return created.id;
  };

  const handleUpload = async () => {
    if (!file || !token || !selectedTopic) {
      return alert("يرجى اختيار التوبيك وتسجيل الدخول واختيار ملف.");
    }

    setUploading(true);

    try {
      const folderId = await createFolderIfNotExists(selectedTopic);

      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [folderId],
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", file);

      const res = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const result = await res.json();

      if (res.ok) {
        const fileId = result.id;
        const driveLink = `https://drive.google.com/file/d/${fileId}/view`;

        await addDoc(collection(db, "presentations"), {
          title: file.name,
          topic: selectedTopic,
          link: driveLink,
          createdAt: serverTimestamp(),
          uploadedBy: userEmail || "غير معروف",
        });

        alert("✅ تم رفع الملف وتسجيله بنجاح!");
        setFile(null);
        setSelectedTopic("");
      } else {
        console.error("❌ Google Drive Error:", JSON.stringify(result, null, 2));
        alert("❌ فشل في رفع الملف: " + (result.error?.message || "حدث خطأ غير معروف."));
      }
    } catch (err) {
      console.error("❌ اتصال Google:", err);
      alert("❌ خطأ في الاتصال بـ Google Drive.");
    }

    setUploading(false);
  };

  const handleLogin = () => {
    navigate("/login-with-google");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-right">
      <h1 className="text-xl font-bold text-blue-900 mb-6">📤 صفحة رفع العروض</h1>

      {!token ? (
        <div className="text-center mt-10">
          <p className="mb-4 text-gray-700">🔐 يجب تسجيل الدخول أولًا لرفع الملفات إلى Google Drive</p>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول باستخدام Google
          </button>
        </div>
      ) : (
        <>
          <label className="block mb-2 font-semibold">🗂 اختر التوبيك:</label>
          <select
            value={selectedTopic}
            onChange={handleTopicChange}
            className="mb-4 p-2 border rounded w-full"
          >
            <option value="">-- اختر التوبيك --</option>
            {topics.map((topic, idx) => (
              <option key={idx} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-semibold">📁 اختر الملف:</label>
          <input type="file" onChange={handleFileChange} className="mb-4 block" />

          <button
            onClick={handleUpload}
            disabled={uploading || !token}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50"
          >
            {uploading ? "⏳ جاري الرفع..." : "رفع العرض"}
          </button>
        </>
      )}
    </div>
  );
}
// src/components/GoogleDriveUploader.jsx
import { useState } from "react";
import { gapi } from "gapi-script";

export default function GoogleDriveUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadToGoogleDrive = async (file, accessToken) => {
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

    if (!response.ok) {
      throw new Error("فشل رفع الملف إلى Google Drive");
    }

    const result = await response.json();
    return `https://drive.google.com/file/d/${result.id}/view`;
  };

  const handleUpload = async () => {
    if (!file) {
      setError("من فضلك اختر ملفًا أولًا");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const accessToken = gapi.auth.getToken().access_token;
      const link = await uploadToGoogleDrive(file, accessToken);
      onUpload(link); // 👈 إرسال الرابط للمكون الأب
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء رفع الملف.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept=".ppt,.pptx,.pdf"
        className="w-full border p-2 rounded"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {uploading ? "جارٍ الرفع..." : "رفع إلى Google Drive"}
      </button>
    </div>
  );
}
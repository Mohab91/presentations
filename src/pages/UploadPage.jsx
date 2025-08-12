// src/pages/UploadPage.jsx
import UploadPresentation from "../components/UploadPresentation";

export default function UploadPage({ user, role }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-6 text-right text-blue-900">📤 صفحة رفع عرض</h1>
      <UploadPresentation user={user} role={role} />
    </div>
  );
}
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function ManageUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  if (loading) return <p className="text-center">جاري تحميل المستخدمين...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-right">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">👤 إدارة المستخدمين</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">البريد الإلكتروني</th>
            <th className="p-2">الدور</th>
            <th className="p-2">تغيير الدور</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2 font-bold text-blue-700">{u.role}</td>
              <td className="p-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="viewer">مشاهد</option>
                  <option value="lecturer">محاضر</option>
                  <option value="admin">مدير</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
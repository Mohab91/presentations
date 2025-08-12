export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center flex-row-reverse">
      <h1 className="text-xl font-semibold text-blue-900">
        🎓 منصة العروض التقديمية
      </h1>
      <button className="text-sm text-blue-600 hover:text-blue-800 transition underline">
        تسجيل الخروج
      </button>
    </header>
  );
}
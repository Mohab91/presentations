import PresentationsList from "../components/PresentationsList";

export default function PresentationsPage({ role }) {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-right">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📚 العروض التدريبية</h1>
      <PresentationsList role={role} />
    </div>
  );
}
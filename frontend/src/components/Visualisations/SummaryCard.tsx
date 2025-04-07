export default function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-md flex flex-col text-center border border-blue-200">
      <span className="text-sm text-blue-600 font-medium">{label}</span>
      <span className="text-2xl font-bold text-blue-800">{value}</span>
    </div>
  );
}

export default function ChartAnalysis({
  data,
  field,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  field: string;
  label: string;
}) {
  if (data.length === 0) return null;

  const values = data.map((d) => d[field]);
  const months = data.map((d) => d.Month);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const minMonth = months[values.indexOf(minValue)];
  const maxMonth = months[values.indexOf(maxValue)];
  const percentageChange = (((maxValue - minValue) / minValue) * 100).toFixed(
    2
  );

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg shadow border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">
        Analysis for {label}
      </h4>
      <p className="text-sm text-gray-600">
        The minimum value was in <strong>{minMonth}</strong> ({minValue}), and
        the maximum value was in <strong>{maxMonth}</strong> ({maxValue}). The
        percentage change throughout the year was{" "}
        <strong>{percentageChange}%</strong>.
      </p>
    </div>
  );
}

import { JSX } from "react";

// src/components/ChartPanel.tsx
export default function ChartPanel({
  title,
  chart,
  description,
}: {
  title: string;
  chart: JSX.Element;
  description: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      {chart}
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
}

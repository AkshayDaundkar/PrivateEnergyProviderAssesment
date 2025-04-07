import { useState } from "react";
import { Line } from "react-chartjs-2";

type Props = {
  data: {
    Country: string;
    Year: number;
    "Total Energy Consumption (TWh)": number;
    "Total Energy Generation (TWh)": number;
  }[];
  allCountries: string[];
  allYears: number[];
};

export default function ConsumptionVsGenerationChart({
  data,
  allCountries,
  allYears,
}: Props) {
  const [cgCountry, setCgCountry] = useState("");
  const [cgYear, setCgYear] = useState("");

  const filtered = data.filter(
    (d) =>
      (!cgCountry || d.Country === cgCountry) &&
      (!cgYear || d.Year === parseInt(cgYear))
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        ⚖️ Consumption vs Generation
      </h2>

      <div className="flex gap-4 mb-4">
        <select
          value={cgCountry}
          onChange={(e) => setCgCountry(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Country</option>
          {allCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={cgYear}
          onChange={(e) => setCgYear(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Year</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <Line
        data={{
          labels: filtered.map((d) => d.Year),
          datasets: [
            {
              label: "Consumption (TWh)",
              data: filtered.map((d) => d["Total Energy Consumption (TWh)"]),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.2)",
            },
            {
              label: "Generation (TWh)",
              data: filtered.map((d) => d["Total Energy Generation (TWh)"]),
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.2)",
            },
          ],
        }}
      />
    </div>
  );
}

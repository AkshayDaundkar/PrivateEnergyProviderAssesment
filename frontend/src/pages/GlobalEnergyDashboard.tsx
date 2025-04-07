import Sidebar from "../components/Visualisations/Sidebar";
import Header from "../components/Visualisations/Header";
import SummaryCard from "../components/Visualisations/SummaryCard";
import { Line, Bar, Pie, Radar } from "react-chartjs-2";
import { useState, useEffect, JSX } from "react";
import "chart.js/auto";

export default function GlobalEnergyDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [maxEnergy, setMaxEnergy] = useState<number | null>(null);

  const monthsOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8000/energy/global");
      const json = await res.json();
      setData(json);

      const countries = Array.from(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Set(json.map((d: any) => d.Country))
      ).sort() as string[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const years = Array.from(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Set(json.map((d: any) => d.Year)) as Set<number>
      ).sort((a, b) => a - b);
      setAllCountries(countries);
      setAllYears(years);
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    (d) =>
      (!country || d.Country === country) &&
      (!year || d.Year === parseInt(year)) &&
      (!maxEnergy || d["Total Energy Consumption (TWh)"] <= maxEnergy)
  );

  const groupedByMonth = monthsOrder.map((month) => {
    const entries = filteredData.filter((d) => d.Month === month);
    const mean = (field: string) =>
      entries.reduce((sum, d) => sum + (d[field] || 0), 0) /
      (entries.length || 1);
    return {
      Month: month,
      TWh: mean("Total Energy Consumption (TWh)"),
      Emissions: mean("Carbon Emissions (Million Tons)"),
      PerCapita: mean("Per Capita Energy Use (kWh)"),
      Renewable: mean("Renewable Energy Share (%)"),
      Fossil: mean("Fossil Fuel Dependency (%)"),
      Price: mean("Energy Price Index (USD/kWh)"),
    };
  });

  const summary = (field: keyof (typeof groupedByMonth)[0]) => {
    const sorted = [...groupedByMonth].sort(
      (a, b) => Number(a[field]) - Number(b[field])
    );
    return {
      min: sorted[0]?.Month,
      max: sorted[sorted.length - 1]?.Month,
      total: groupedByMonth
        .reduce((sum, d) => sum + Number(d[field]), 0)
        .toFixed(2),
    };
  };

  const average = (field: string) =>
    (
      filteredData.reduce((sum, d) => sum + (d[field] || 0), 0) /
      (filteredData.length || 1)
    ).toFixed(2);

  const chartWrapper = (
    title: string,
    chart: JSX.Element,
    summaryText: string
  ) => (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {chart}
      <p className="text-sm text-gray-600 mt-2">{summaryText}</p>
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar toggleTheme={() => {}} />
      <main className="flex-1 p-6 overflow-y-auto">
        <Header>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="">All Countries</option>
            {allCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="p-2 rounded border"
          >
            <option value="">All Years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={maxEnergy ?? ""}
            onChange={(e) =>
              setMaxEnergy(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="p-2 rounded border"
          >
            <option value="">Any Energy Use</option>
            <option value="10000">Below 10,000 TWh</option>
            <option value="5000">Below 5,000 TWh</option>
            <option value="1000">Below 1,000 TWh</option>
          </select>
        </Header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
          <SummaryCard
            label="Avg. Energy Consumption (TWh)"
            value={average("Total Energy Consumption (TWh)")}
          />
          <SummaryCard
            label="Avg. Per Capita (kWh)"
            value={average("Per Capita Energy Use (kWh)")}
          />
          <SummaryCard
            label="Total Emissions (MTons)"
            value={average("Carbon Emissions (Million Tons)")}
          />
          <SummaryCard
            label="Avg. Price (USD/kWh)"
            value={average("Energy Price Index (USD/kWh)")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {chartWrapper(
            "Total Energy Consumption",
            <Bar
              data={{
                labels: groupedByMonth.map((d) => d.Month),
                datasets: [
                  {
                    label: "TWh",
                    data: groupedByMonth.map((d) => d.TWh),
                    backgroundColor: "#3b82f6",
                  },
                ],
              }}
            />,
            `Analysis of Total energy consumption: ${summary("TWh").total} TWh. 
Highest in ${summary("TWh").max} (${Math.max(
              ...groupedByMonth.map((d) => d.TWh)
            ).toFixed(2)} TWh), 
Lowest in ${summary("TWh").min} (${Math.min(
              ...groupedByMonth.map((d) => d.TWh)
            ).toFixed(2)} TWh), 
Average: ${average("Total Energy Consumption (TWh)")} TWh.`
          )}

          {chartWrapper(
            "Carbon Emissions",
            <Bar
              data={{
                labels: groupedByMonth.map((d) => d.Month),
                datasets: [
                  {
                    label: "CO₂ (Million Tons)",
                    data: groupedByMonth.map((d) => d.Emissions),
                    backgroundColor: "#ef4444",
                  },
                ],
              }}
            />,
            `Total emissions: ${summary("Emissions").total} MTons. Highest in ${
              summary("Emissions").max
            } (${Math.max(...groupedByMonth.map((d) => d.Emissions)).toFixed(
              2
            )} MTons), Lowest in ${summary("Emissions").min} (${Math.min(
              ...groupedByMonth.map((d) => d.Emissions)
            ).toFixed(2)} MTons), Average: ${average(
              "Carbon Emissions (Million Tons)"
            )} MTons.`
          )}

          {chartWrapper(
            "Per Capita Energy Use",
            <Line
              data={{
                labels: groupedByMonth.map((d) => d.Month),
                datasets: [
                  {
                    label: "kWh/person",
                    data: groupedByMonth.map((d) => d.PerCapita),
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.2)",
                  },
                ],
              }}
            />,
            `Total per capita energy use: ${
              summary("PerCapita").total
            } kWh/person. Highest in ${summary("PerCapita").max} (${Math.max(
              ...groupedByMonth.map((d) => d.PerCapita)
            ).toFixed(2)} kWh/person), Lowest in ${
              summary("PerCapita").min
            } (${Math.min(...groupedByMonth.map((d) => d.PerCapita)).toFixed(
              2
            )} kWh/person), Average: ${average(
              "Per Capita Energy Use (kWh)"
            )} kWh/person.`
          )}

          {chartWrapper(
            "Renewable vs Fossil Share",
            <Bar
              data={{
                labels: groupedByMonth.map((d) => d.Month),
                datasets: [
                  {
                    label: "Renewable (%)",
                    data: groupedByMonth.map((d) => d.Renewable),
                    backgroundColor: "#0ea5e9",
                  },
                  {
                    label: "Fossil (%)",
                    data: groupedByMonth.map((d) => d.Fossil),
                    backgroundColor: "#f97316",
                  },
                ],
              }}
            />,
            `Average renewable energy share: ${average(
              "Renewable Energy Share (%)"
            )}%. Average fossil fuel dependency: ${average(
              "Fossil Fuel Dependency (%)"
            )}%.`
          )}

          {chartWrapper(
            "Energy Use Breakdown",
            <Pie
              data={{
                labels: ["Industrial Use", "Household Use"],
                datasets: [
                  {
                    label: "Use %",
                    data: [
                      average("Industrial Energy Use (%)"),
                      average("Household Energy Use (%)"),
                    ],
                    backgroundColor: ["#6366f1", "#facc15"],
                  },
                ],
              }}
            />,
            `Average industrial energy use: ${average(
              "Industrial Energy Use (%)"
            )}%. Average household energy use: ${average(
              "Household Energy Use (%)"
            )}%.`
          )}

          {chartWrapper(
            "Price Index & Other KPIs",
            <Radar
              data={{
                labels: ["Per Capita", "Emissions", "Fossil %", "Price"],
                datasets: [
                  {
                    label: "Indicators",
                    data: [
                      average("Per Capita Energy Use (kWh)"),
                      average("Carbon Emissions (Million Tons)"),
                      average("Fossil Fuel Dependency (%)"),
                      average("Energy Price Index (USD/kWh)"),
                    ],
                    borderColor: "#fbbf24",
                    backgroundColor: "rgba(251,191,36,0.2)",
                  },
                ],
              }}
            />,
            `Average per capita energy use: ${average(
              "Per Capita Energy Use (kWh)"
            )} kWh. Average emissions: ${average(
              "Carbon Emissions (Million Tons)"
            )} MTons. Average fossil fuel dependency: ${average(
              "Fossil Fuel Dependency (%)"
            )}%. Average energy price index: ${average(
              "Energy Price Index (USD/kWh)"
            )} USD/kWh.`
          )}
        </div>
      </main>
    </div>
  );
}

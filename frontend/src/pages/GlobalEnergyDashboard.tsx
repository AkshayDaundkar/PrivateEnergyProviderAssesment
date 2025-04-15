import Sidebar from "../components/Visualisations/Sidebar";
import Header from "../components/Visualisations/Header";
import SummaryCard from "../components/Visualisations/SummaryCard";
import { Line, Bar, Pie, Radar } from "react-chartjs-2";
import { useState, useEffect, JSX } from "react";
import "chart.js/auto";
import WorldEnergyMapD3 from "./WorldEnergyBubbleMap";
import ConsumptionVsGenerationChart from "../components/Visualisations/ConsumptionVsGenerationChart";
import { ErrorBoundary } from "../ErrorBoundary";

export default function GlobalEnergyDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<number[]>([]);
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [maxEnergy, setMaxEnergy] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);

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
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      console.log("BASE URL:", import.meta.env.VITE_API_BASE_URL);

      const res = await fetch(`${baseURL}/energy/global`);
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
  ) => {
    const id = title.toLowerCase().replace(/\s+/g, "-");
    return (
      <div
        id={id}
        className="relative bg-white rounded shadow p-4"
        style={{ position: "relative" }}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const canvas = document.querySelector(
                  `#${id} canvas`
                ) as HTMLCanvasElement;
                if (canvas) {
                  const link = document.createElement("a");
                  link.download = `${id}.png`;
                  link.href = canvas.toDataURL("image/png");
                  link.click();
                }
              }}
              title="Download Chart"
            >
              <svg
                className="w-4 h-4 text-gray-500 hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>

            <button
              onClick={() => {
                const chartDiv = document.getElementById(id);
                if (chartDiv?.requestFullscreen) {
                  chartDiv.requestFullscreen();
                }
              }}
              title="Fullscreen Chart"
            >
              <svg
                className="w-4 h-4 text-gray-500 hover:text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6" />
              </svg>
            </button>
          </div>
        </div>

        {chart}
        <p className="text-sm text-gray-600 mt-2">{summaryText}</p>
      </div>
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        toggleTheme={() => {}}
      />

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-10">
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
            "Renewable vs Fossil Share",
            <Bar
              data={{
                labels: groupedByMonth.map((d) => d.Month),
                datasets: [
                  {
                    label: "Renewable (%)",
                    data: groupedByMonth.map((d) => d.Renewable),
                    backgroundColor: "rgba(14,165,233,0.6)", // blue-400
                    borderColor: "#0284c7", // blue-600
                    borderWidth: 1,
                  },
                  {
                    label: "Fossil (%)",
                    data: groupedByMonth.map((d) => d.Fossil),
                    backgroundColor: "rgba(249,115,22,0.6)", // orange-500
                    borderColor: "#c2410c", // orange-700
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    labels: { color: "#374151" }, // text-slate-700
                  },
                },
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
            <div className="h-64 w-full">
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
                      backgroundColor: ["#6366f1", "#facc15"], // indigo + yellow
                      borderColor: ["#4f46e5", "#eab308"], // deeper accents
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: "#374151",
                        font: { size: 10 },
                      },
                      position: "bottom",
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>,
            `Average industrial energy use: ${average(
              "Industrial Energy Use (%)"
            )}%. Average household energy use: ${average(
              "Household Energy Use (%)"
            )}%.`
          )}
          <ErrorBoundary>
            <WorldEnergyMapD3 data={filteredData} />
          </ErrorBoundary>
        </div>
        <div className="mt-10 flex flex-col lg:flex-row gap-6">
          {/* Left 2/3: Chart */}
          <div className="lg:w-2/3 w-full">
            <ConsumptionVsGenerationChart
              data={filteredData}
              allCountries={allCountries}
              allYears={allYears}
            />
          </div>

          {/* Right 1/3: World Map */}
          <div className="lg:w-1/3 w-full">
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
                      borderColor: "#f59e0b", // amber-500
                      backgroundColor: "rgba(251,191,36,0.3)", // amber-300
                      pointBackgroundColor: "#facc15",
                    },
                  ],
                }}
                options={{
                  scales: {
                    r: {
                      angleLines: { color: "#e5e7eb" },
                      grid: { color: "#cbd5e1" },
                      pointLabels: { color: "#475569" },
                    },
                  },
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
        </div>
      </main>
    </div>
  );
}

// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("line");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8000/energy/mock");
      setData(res.data);
    };
    fetchData();
  }, []);

  const filtered = data.filter((item: any) => {
    const ts = dayjs(item.timestamp);
    const matchType = !typeFilter || item.type === typeFilter;
    const matchSource = !sourceFilter || item.source === sourceFilter;
    const matchStart = !startDate || ts.isAfter(dayjs(startDate));
    const matchEnd = !endDate || ts.isBefore(dayjs(endDate));
    return matchType && matchSource && matchStart && matchEnd;
  });

  const timestamps = filtered.map((d: any) => d.timestamp);
  const values = filtered.map((d: any) => d.value_kwh);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: `${typeFilter || "All"} - ${sourceFilter || "All"}`,
        data: values,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  const totalKwh = values.reduce((sum, val) => sum + val, 0);
  const avgKwh = values.length > 0 ? (totalKwh / values.length).toFixed(2) : 0;

  const handleChatSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8000/query-ai", {
        question: chatInput,
      });
      setChatResponse(res.data.answer || "No answer returned");
    } catch (error) {
      setChatResponse("Error fetching response from AI.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded shadow"
        >
          <option value="">All Types</option>
          <option value="generation">Generation</option>
          <option value="consumption">Consumption</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="border p-2 rounded shadow"
        >
          <option value="">All Sources</option>
          <option value="solar">Solar</option>
          <option value="wind">Wind</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded shadow"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded shadow"
        />

        <button
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Toggle {chartType === "line" ? "Bar" : "Line"} Chart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-sm text-gray-600">Total Energy (kWh)</h3>
          <p className="text-xl font-semibold">{totalKwh.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-sm text-gray-600">Average kWh</h3>
          <p className="text-xl font-semibold">{avgKwh}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="text-sm text-gray-600">Records</h3>
          <p className="text-xl font-semibold">{filtered.length}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {chartType === "line" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      <div className="mt-10 bg-gray-50 border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          💬 Ask AI about energy trends
        </h2>
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="e.g., What's the total solar generation this week?"
          className="w-full p-2 border rounded mb-2"
        ></textarea>
        <button
          onClick={handleChatSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Ask AI
        </button>
        {chatResponse && (
          <div className="mt-4 bg-white p-3 border rounded">
            <p>
              <strong>AI Response:</strong>
            </p>
            <p>{chatResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

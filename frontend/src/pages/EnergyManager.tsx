import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Visualisations/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EnergyManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    country: "",
    type: "consumption",
    source: "mixed",
    value_kwh: "",
    date: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    country: "",
    type: "",
    source: "",
    date: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const fetchData = async () => {
    const res = await axios.get(`${API_BASE}/energy`, {
      params: { page, limit: 50 },
    });
    setData(res.data.records);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async () => {
    const payload = { ...form, value_kwh: parseFloat(form.value_kwh) };
    if (editingId) {
      await axios.put(`${API_BASE}/energy/${editingId}`, payload);
    } else {
      await axios.post(`${API_BASE}/energy`, payload);
    }
    setForm({
      country: "",
      type: "consumption",
      source: "mixed",
      value_kwh: "",
      date: "",
    });
    setEditingId(null);
    fetchData();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      ...item,
      value_kwh: item.value_kwh.toString(),
      date: item.date.split("T")[0],
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await axios.delete(`${API_BASE}/energy/${id}`);
      fetchData();
    }
  };

  const filteredData = data.filter((row) =>
    Object.entries(filters).every(
      ([key, value]) =>
        value === "" ||
        row[key]?.toString().toLowerCase().includes(value.toLowerCase())
    )
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        toggleTheme={() => {}}
      />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center gap-2">
          ⚡ Energy Data Manager
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow">
          <input
            className="input border px-3 py-2 rounded"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <select
            className="input border px-3 py-2 rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="consumption">Consumption</option>
            <option value="generation">Generation</option>
          </select>
          <input
            className="input border px-3 py-2 rounded"
            placeholder="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          <input
            className="input border px-3 py-2 rounded"
            type="number"
            placeholder="Value (kWh)"
            value={form.value_kwh}
            onChange={(e) => setForm({ ...form, value_kwh: e.target.value })}
          />
          <input
            className="input border px-3 py-2 rounded"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            {editingId ? "Update" : "Add"} Record
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto border">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                {[
                  "country",
                  "type",
                  "source",
                  "value_kwh",
                  "date",
                  "actions",
                ].map((col) => (
                  <th className="p-2 text-left capitalize" key={col}>
                    {col !== "actions" ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        placeholder={`Filter ${col}`}
                        value={filters[col as keyof typeof filters] || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, [col]: e.target.value })
                        }
                      />
                    ) : (
                      "Actions"
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.map((row) => (
                <tr key={row._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{row.country}</td>
                  <td className="p-2 capitalize">{row.type}</td>
                  <td className="p-2">{row.source}</td>
                  <td className="p-2">{row.value_kwh.toLocaleString()}</td>
                  <td className="p-2">{row.date.split("T")[0]}</td>
                  <td className="p-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(row._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ⬅ Previous
          </button>

          <span className="text-gray-600 text-sm">
            Page {page} of {Math.ceil(total / 50)}
          </span>

          <button
            disabled={page * 50 >= total}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}

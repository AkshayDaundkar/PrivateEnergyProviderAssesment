import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Visualisations/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EnergyManager() {
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
  const [debouncedFilters, setDebouncedFilters] = useState(filters); // For debounce
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [filters]);

  const fetchData = async () => {
    const res = await axios.get(`${API_BASE}/energy`, {
      params: {
        page,
        limit: 50,
        ...debouncedFilters,
      },
    });
    setData(res.data.records);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedFilters]);

  const handleSubmit = async () => {
    const payload = { ...form, value_kwh: parseFloat(form.value_kwh) };
    if (editingId) {
      await axios.put(`${API_BASE}/energy/${editingId}`, payload);
      alert("Record updated successfully!");
    } else {
      await axios.post(`${API_BASE}/energy`, payload);
      alert("Record added successfully!");
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

  const totalPages = Math.ceil(total / 50);

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

        {/* Form */}
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

        {/* Table */}
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
              {data.map((row) => (
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
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ⏮ First
          </button>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next ➡
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Last ⏭
          </button>
        </div>
      </div>
    </div>
  );
}

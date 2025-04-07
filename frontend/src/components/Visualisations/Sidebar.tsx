// src/components/Sidebar.tsx
import {
  FaChartLine,
  FaHome,
  FaDatabase,
  FaBrain,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ toggleTheme }: { toggleTheme: () => void }) {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  return (
    <aside className="bg-[#0f172a] text-white h-screen w-64 flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-8">🔋 PEP Energy</h2>
      <nav className="flex flex-col gap-4 text-lg">
        <a href="#" className="flex items-center gap-2 hover:text-blue-400">
          <FaHome /> Overview
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-400">
          <FaChartLine /> Dashboard
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-400">
          <FaDatabase /> Data
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-blue-400">
          <FaBrain /> AI Insights
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-600">
        <button
          onClick={handleThemeToggle}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400"
        >
          {darkMode ? <FaSun /> : <FaMoon />}{" "}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}

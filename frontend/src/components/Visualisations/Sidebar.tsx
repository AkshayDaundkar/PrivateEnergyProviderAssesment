import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import SidebarToggle from "./SidebarToggle";

export default function Sidebar({
  collapsed,
  setCollapsed,
  toggleTheme,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleTheme: () => void;
}) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`relative bg-[#0f172a] text-white shadow-md transition-all duration-300 flex flex-col h-full-screen 
  ${collapsed ? "w-20" : "w-64"} 
  hidden sm:flex`} // <== Add "hidden sm:flex"
    >
      {/* Toggle */}
      <SidebarToggle
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:text-blue-400"
          >
            <FaChartLine className="text-xl" />
            {!collapsed && <span className="text-md">Dashboard</span>}
          </Link>
        </div>

        <div className="mt-1 p-2 flex flex-col gap-4">
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              toggleTheme();
            }}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400"
          ></button>
        </div>
      </div>
    </div>
  );
}

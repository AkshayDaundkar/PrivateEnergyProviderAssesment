import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type SidebarToggleProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SidebarToggle({
  collapsed,
  onToggle,
}: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-1/2 left-[4.25rem] transform -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all duration-300"
      style={{
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid white",
      }}
    >
      {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
    </button>
  );
}

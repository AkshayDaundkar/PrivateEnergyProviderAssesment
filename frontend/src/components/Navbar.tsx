import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black bg-opacity-60 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-white font-bold text-xl">
        <span className="text-blue-500">Private</span>Energy
      </h1>
      <div className="space-x-4">
        <Link to="/login" className="text-white hover:text-blue-400 transition">
          Login
        </Link>
        <Link
          to="/register"
          className="text-white hover:text-blue-400 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#0f172a] px-6 py-4 flex justify-between items-center shadow-md text-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">
          <span className="text-blue-500">Private</span> Energy Providers
        </Link>
      </div>

      <div className="space-x-4 flex items-center text-sm">
        {user ? (
          <>
            <span className="hidden sm:inline">
              Welcome,{" "}
              <span className="font-semibold text-blue-400">
                {user.firstName}
              </span>
            </span>
            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-400">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

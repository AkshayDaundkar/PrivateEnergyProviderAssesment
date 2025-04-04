import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";

type AuthProps = {
  type: "login" | "register";
};

export default function AuthForm({ type }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiCall = type === "login" ? loginUser : registerUser;
      const res = await apiCall({ email, password });

      if (type === "login") {
        localStorage.setItem("token", res.data.access_token);
        alert("Login Successful 🎉");
        // navigate("/dashboard");
      } else {
        alert("Registered successfully! Login now ✨");
        navigate("/login");
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="bg-white/30 backdrop-blur-xl shadow-xl p-8 rounded-2xl w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          {type === "login" ? "Login" : "Register"} to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/60 text-blue-900 placeholder-blue-600 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/60 text-blue-900 placeholder-blue-600 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
          >
            {loading ? "Loading..." : type === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

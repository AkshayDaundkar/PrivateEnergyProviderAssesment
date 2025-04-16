/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

type AuthProps = {
  type: "login" | "register";
};

export default function AuthForm({ type }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, number, and symbol"
      );
      return;
    }

    setLoading(true);

    try {
      const res =
        type === "login"
          ? await loginUser({ email, password })
          : await registerUser({ email, password, firstName, lastName });

      if (type === "login") {
        const userData = {
          email,
          firstName: res.data.firstName || "User",
          lastName: res.data.lastName || "",
        };
        login(userData);
        localStorage.setItem("token", res.data.access_token);

        toast.success("🎉 Login Successful");
        navigate("/dashboard");
      } else {
        toast.success("✨ Registered successfully! Login now.");
        navigate("/login");
      }
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.detail ||
        "Something went wrong. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="bg-white/30 backdrop-blur-xl shadow-xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          {type === "login" ? "Login" : "Register"} to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 text-blue-900 placeholder-blue-600 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/60 text-blue-900 placeholder-blue-600 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            {loading ? "Loading..." : type === "login" ? "Login" : "Register"}
          </button>

          <div className="text-center text-sm mt-4 text-blue-700">
            {type === "login" ? (
              <>
                Don’t have an account?{" "}
                <a href="/register" className="underline">
                  Register
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/login" className="underline">
                  Login
                </a>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalEnergyDashboard from "./pages/GlobalEnergyDashboard";
import ChatComponent from "./components/ChatComponent";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import EditUser from "./components/EditUserForm";
import EnergyManager from "./pages/EnergyManager";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="text-center mt-10 text-blue-700">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50"></div>
        <p className="text-blue-700 text-sm font-medium">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {user && <Route path="/edit-user" element={<EditUser user={user} />} />}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <GlobalEnergyDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/energy-manager"
          element={
            <PrivateRoute>
              <EnergyManager />
            </PrivateRoute>
          }
        />
      </Routes>
      {user && <ChatComponent />}
      <Footer />
    </BrowserRouter>
  );
}

export default App;

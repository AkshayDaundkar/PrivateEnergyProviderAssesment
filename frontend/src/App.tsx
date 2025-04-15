import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalEnergyDashboard from "./pages/GlobalEnergyDashboard";
import ChatComponent from "./components/ChatComponent";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <GlobalEnergyDashboard />
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

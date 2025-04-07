import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalEnergyDashboard from "./pages/GlobalEnergyDashboard";
import ChatComponent from "./components/ChatComponent"
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<GlobalEnergyDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ChatComponent/>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;

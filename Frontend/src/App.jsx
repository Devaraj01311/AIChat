import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Hero from "./pages/Hero";

function App() {
  return (
    <BrowserRouter>
    <Toaster
  position="top-center"
  toastOptions={{
    style: {
      background: "var(--toast-bg)",
      color: "var(--toast-color)",
      backdropFilter: "blur(8px)", 
      borderRadius: "12px",
      padding: "12px 16px",
      border: "1px solid rgba(255, 255, 255, 0.1)", 
    },
  }}
/>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

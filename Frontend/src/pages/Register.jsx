import { useState } from "react";
import api from "../server/api.js";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, User } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Standard Registration
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/register", form);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Check if email exists.");
    } finally {
      setLoading(false);
    }
  };

  // Guest Login Handler
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/guest");
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
      toast.success("Welcome, Guest!");
    } catch (error) {
      console.error("Guest login failed:", error);
      toast.error("Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  //  Google OAuth Handler
 const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0d0d0d] font-sans">
      {/* --- Top Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-10 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <Sparkles size={24} className="text-[#1a73e8]" fill="#1a73e8" />
          <span className="text-lg font-bold tracking-tight">AI Chat</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-gray-500 text-sm">Already have an account?</span>
          <Link to="/login" className="text-[#141414] hover:underline text-sm font-medium">
            Log in
          </Link>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-100">
          
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold mb-3 tracking-tight">Create your account</h1>
            <p className="text-gray-500 text-sm">Join our AI workspace to get started</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[#0d0d0d] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all placeholder:text-gray-400"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[#0d0d0d] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all placeholder:text-gray-400"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[#0d0d0d] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all placeholder:text-gray-400"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d333a] text-white font-medium py-3 rounded-md hover:bg-[#1a1f24] transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>

            <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-4 text-xs text-gray-400 font-medium uppercase tracking-widest">OR</span>
              <div className="grow border-t border-gray-200"></div>
            </div>
            <div className="space-y-3">
              {/* Google Button */}
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-start gap-3 bg-white border border-gray-300 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                <span>Sign up with Google</span>
              </button>
              <button 
                type="button" 
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-start gap-3 bg-gray-50 border border-gray-300 px-4 py-2.5 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span>Continue as Guest</span>
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-[12px] text-gray-500 leading-relaxed px-4">
            By creating an account, you agree to our 
            <a href="#" className="text-[#10a37f] hover:underline mx-1">Terms of Service</a> 
            and 
            <a href="#" className="text-[#10a37f] hover:underline mx-1">Privacy Policy</a>.
          </p>
        </div>
      </main>
      <footer className="py-6 text-center text-[11px] text-gray-400">
        © 2026 AI Chat Inc. All rights reserved.
      </footer>
    </div>
  );
}
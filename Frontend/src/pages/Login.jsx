import { useState, useEffect } from "react";
import api from "../server/api.js";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  //Check for Google OAuth Token in URL on component mount
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in with Google");
      navigate("/chat", { replace: true });
    }
  }, [searchParams, navigate]);

  //Standard Email Login
  const login = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/chat");
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  //Guest Login Handler
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

  //Google Login Handler (Direct Browser Redirect)
 const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL ;
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0d0d0d] font-sans">
      <nav className="flex items-center justify-between px-6 py-4 md:px-10 border-b border-gray-100">
        <div className="flex items-center gap-2">
         <Sparkles size={24} className="text-[#1a73e8]" fill="#1a73e8" />
          <span className="text-lg font-bold tracking-tight">AI Chat</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-gray-500 text-sm">Don't have an account?</span>
          <Link to="/register" className="text-[#121313] hover:underline text-sm font-medium">
            Sign up
          </Link>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-100 transition-all">
          
          <div className="text-center mb-8">
            <h1 className="text-[32px] font-bold mb-3 tracking-tight">Welcome back</h1>
          </div>

          <form className="space-y-4" onSubmit={login}>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[#0d0d0d] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[#0d0d0d] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] transition-all placeholder:text-gray-400"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d333a] text-white font-medium py-3 rounded-md hover:bg-[#1a1f24] transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
            <div className="relative flex items-center py-4">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-4 text-xs text-gray-400 font-medium uppercase tracking-widest">OR</span>
              <div className="grow border-t border-gray-200"></div>
            </div>
            <div className="space-y-3">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-start gap-3 bg-white border border-gray-300 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
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

          <div className="mt-8 text-center text-xs text-gray-500 flex justify-center gap-2">
            <a href="#" className="hover:underline text-[#10a37f]">Terms of use</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline text-[#10a37f]">Privacy policy</a>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-[11px] text-gray-400">
        © 2026 AI Chat Inc. All rights reserved.
      </footer>
    </div>
  );
}
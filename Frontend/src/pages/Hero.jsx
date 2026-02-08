import React from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, LogIn, MessageSquare, History, 
  Shield, Zap, Code2, Layout, Smartphone, Menu 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- BACKGROUND GRID SYSTEM --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.18]" 
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: 'clamp(30px, 5vw, 40px) clamp(30px, 5vw, 40px)',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
        {/* Decorative Glowing Squares */}
        <div className="absolute top-[20%] right-[10%] w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-xl blur-sm" />
        <div className="absolute bottom-[20%] left-[5%] w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl blur-sm" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 py-6 max-w-360 mx-auto border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          {/* Reverted to Old Logo Design */}
          <div className="w-9 h-9 bg-blue-500/10 border border-gray-700 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(26,115,232,0.4)]">
             <Sparkles size={20} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AI Chat</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-gray-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#preview" className="hover:text-blue-400 transition-colors">Interface</a>
          </div>
          <Link to="/login" className="flex items-center gap-2 bg-blue-500/10 border border-gray-50 text-white px-5 sm:px-7 py-2.5 rounded-full text-[13px] font-bold hover:border-blue-800 transition-all shadow-lg shadow-blue-500/20">
            <LogIn size={16} />
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex flex-col items-center pt-16 md:pt-28 px-4 sm:px-6 pb-20">
        
        {/* Status Pill */}
        <div className="mb-8 md:mb-10 flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Live v1.0
          </span>
          <div className="h-3 w-px bg-white/20" />
          <span className="text-[12px] sm:text-[14px] text-gray-200 font-medium">
            Professional Studio Interface
          </span>
        </div>

        {/* Headlines - Increased Contrast */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.05] text-white">
            AI Chat <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400 italic font-light">
              Reimagined.
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto px-4">
            A high-performance environment for building, testing, and managing your AI conversations with precision.
          </p>
        </div>

        {/* --- THE INTERFACE PREVIEW --- */}
        <div id="preview" className="relative w-full max-w-5xl group mb-24 md:mb-32">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl md:rounded-4xl blur-3xl opacity-30"></div>
            
            <div className="relative bg-[#0a0a0a] rounded-3xl md:rounded-4xl border border-white/10 overflow-hidden shadow-2xl flex flex-col aspect-4/5 sm:aspect-video md:aspect-21/9">
                {/* Mock UI Header */}
                <div className="h-12 border-b border-white/5 bg-white/3 flex items-center px-5 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    </div>
                    <div className="h-5 w-32 bg-white/5 rounded-full border border-white/10" />
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Mock Sidebar */}
                    <div className="w-48 border-r border-white/5 bg-white/1 p-5 hidden md:block">
                        <div className="h-9 w-full bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6" />
                        <div className="space-y-4">
                            <div className="h-2 w-3/4 bg-white/20 rounded" />
                            <div className="h-2 w-1/2 bg-white/10 rounded" />
                            <div className="h-2 w-2/3 bg-white/10 rounded" />
                        </div>
                    </div>
                    <div className="flex-1 p-5 sm:p-10 flex flex-col gap-8">
                        <div className="md:hidden"><Menu size={20} className="text-gray-500" /></div>
                        <div className="flex flex-col items-end">
                            <div className="h-12 w-[85%] sm:w-2/3 bg-blue-600/10 border border-blue-500/30 rounded-2xl rounded-tr-none" />
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] shrink-0 flex items-center justify-center">
                                <Sparkles size={16} className="text-white" fill="white" />
                            </div>
                            <div className="space-y-3 w-full pt-1">
                                <div className="h-2.5 w-full bg-white/20 rounded" />
                                <div className="h-2.5 w-[90%] bg-white/20 rounded" />
                                <div className="h-2.5 w-[40%] bg-white/10 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* COLORED FEATURE CARDS */}
        <div id="features" className="w-full max-w-6xl px-2">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-12 text-center">System Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <FeatureCard 
                    title="Session History" 
                    desc="Encrypted chat persistence that saves your progress automatically across devices."
                    icon={<History size={24} />}
                    color="blue"
                />
                <FeatureCard 
                    title="Code Specialist" 
                    desc="Rich Markdown support with syntax highlighting for 50+ programming languages."
                    icon={<Code2 size={24} />}
                    color="emerald"
                />
                <FeatureCard 
                    title="Enterprise Security" 
                    desc="JWT-powered authentication ensuring your conversations remain private and protected."
                    icon={<Shield size={24} />}
                    color="purple"
                />
                <FeatureCard 
                    title="Studio UI" 
                    desc="High-contrast dark mode design optimized for long-term focus and developer speed."
                    icon={<Layout size={24} />}
                    color="orange"
                />
                <FeatureCard 
                    title="Fully Responsive" 
                    desc="Access your studio anywhere. Zero-compromise UI for mobile, tablet, and desktop."
                    icon={<Smartphone size={24} />}
                    color="pink"
                />
                <FeatureCard 
                    title="Real-time Engine" 
                    desc="Near-instant logical processing with optimized API communication streaming."
                    icon={<Zap size={24} />}
                    color="yellow"
                />
            </div>
        </div>
      </main>

      <footer className="relative z-10 py-16 border-t border-white/5 text-center px-6 bg-[#030303]">
        <div className="flex flex-wrap justify-center gap-10 mb-8 text-[14px] font-semibold text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
        </div>
        <p className="font-bold tracking-[0.4em] uppercase text-[10px] text-gray-600">AI Chat Project • 2026</p>
      </footer>
    </div>
  );
}

// COLORED FEATURE CARD COMPONENT 
function FeatureCard({ title, desc, icon, color }) {
    const colors = {
        blue: "border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-blue-500/10",
        emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 shadow-emerald-500/10",
        purple: "border-purple-500/30 bg-purple-500/5 text-purple-400 shadow-purple-500/10",
        orange: "border-orange-500/30 bg-orange-500/5 text-orange-400 shadow-orange-500/10",
        pink: "border-pink-500/30 bg-pink-500/5 text-pink-400 shadow-pink-500/10",
        yellow: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400 shadow-yellow-500/10",
    };

    return (
        <div className={`p-8 border rounded-4xl transition-all hover:scale-[1.02] hover:bg-opacity-10 shadow-xl ${colors[color]}`}>
            <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center mb-6 border border-white/10">
                {icon}
            </div>
            <h3 className="text-white text-xl font-bold mb-3 tracking-tight">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">{desc}</p>
        </div>
    );
}
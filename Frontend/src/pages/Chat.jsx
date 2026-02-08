import React, { useState, useEffect, useRef } from "react";
import api from "../server/api.js";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";
import ChatInput from "../components/ChatInput";
import { ChevronDown, Menu, Sun, Moon } from "lucide-react";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const init = async () => {
      try {
        const uRes = await api.get("/api/auth/me");
        setUser(uRes.data);
        const hRes = await api.get("/api/chat/history");
        setHistory(hRes.data);
      } catch (e) { console.error("Auth error", e); }
    };
    init();
  }, []);

  useEffect(() => { 
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, loading]);

  const loadChat = async (id) => {
    setActiveId(id);
    setLoading(true);
    try {
      const res = await api.get(`/api/chat/history/${id}`);
      setMessages(res.data.map(m => ({ role: m.role, text: m.content })));
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSend = async (overrideText) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;
    
    // UI Update
    if (!overrideText) {
      setMessages(prev => [...prev, { role: "user", text: textToSend }]);
      setInput("");
    }
    
    setLoading(true);
    try {
      const res = await api.post("/api/chat", { message: textToSend, conversationId: activeId });
      setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
      
      // Refresh history to show new chat title
      const hRes = await api.get("/api/chat/history");
      setHistory(hRes.data);
      if (!activeId && hRes.data.length > 0) setActiveId(hRes.data[0].id);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "Error: Could not reach the server." }]);
    } finally { setLoading(false); }
  };

  const handleUpdateMessage = async (index, newText) => {
    const truncated = messages.slice(0, index);
    setMessages([...truncated, { role: "user", text: newText }]);
    handleSend(newText);
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-dark-bg overflow-hidden transition-colors duration-300">
      <Sidebar 
        user={user} history={history} activeId={activeId} 
        onSelect={loadChat} 
        onNewChat={() => { setActiveId(null); setMessages([]); setIsSidebarOpen(false); }} 
        onLogout={() => { localStorage.clear(); window.location.href = "/login"; }}
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-white dark:bg-dark-bg">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1 cursor-pointer">
              <h1 className="text-base md:text-lg font-semibold dark:text-white">AI Chat</h1>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <MessageArea 
            messages={messages} 
            user={user} 
            loading={loading} 
            scrollRef={scrollRef} 
            onUpdateMessage={handleUpdateMessage} 
            onCardClick={(text) => handleSend(text)} 
          />
        </div>

        <ChatInput 
          input={input} 
          setInput={setInput} 
          onSend={() => handleSend()} 
          fileRef={fileRef} 
          loading={loading} 
        />
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${theme === 'dark' ? '#333' : '#ddd'}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}
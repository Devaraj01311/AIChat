import React, { useState, useEffect } from "react";
import { 
  Home, Plus, MessageSquare, MoreVertical, X, LogOut, Settings, Sparkles, Snowflake, Key 
} from "lucide-react";
import api from "../server/api.js";
import { toast } from "react-hot-toast";
import ChatModals from "./ChatModals"; 

export default function Sidebar({ 
  history, 
  activeId, 
  onSelect, 
  onNewChat, 
  user, 
  onLogout,
  isOpen,       
  setIsOpen     
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // --- STATE ---
  const [localHistory, setLocalHistory] = useState(history);
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetChat, setTargetChat] = useState(null);

  // Sync props
  useEffect(() => { setLocalHistory(history) }, [history]);

  // Open the Central Card Menu
  const openChatOptions = (e, chat) => {
    e.stopPropagation();
    setTargetChat(chat);
    setModalOpen(true);
  };

  // Perform Delete
  const handleConfirmDelete = async (id) => {
    try {
      await api.delete(`/api/chat/conversation/${id}`);
      setLocalHistory(prev => prev.filter(c => c.id !== id));
      if (activeId === id) onNewChat();
      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setModalOpen(false);
      setTargetChat(null);
    }
  };

  // Perform Rename
  const handleConfirmRename = async (id, newTitle) => {
    try {
      await api.put(`/api/chat/conversation/${id}`, newTitle, { 
        headers: { "Content-Type": "text/plain"}
      });
      setLocalHistory(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
      toast.success("Renamed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to rename");
    } finally {
      setModalOpen(false);
      setTargetChat(null);
    }
  };

  const navItems = [
    { icon: <Home size={18} />, label: "Home", active: true },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-65 bg-[#f9f9f9] dark:bg-dark-sidebar border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0
      `}>
        <div className="md:hidden absolute top-4 right-4">
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md dark:text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center">
            <Sparkles size={24} className="text-[#1a73e8]" fill="#1a73e8" />
          </div>
          <span className="text-[18px] font-medium text-gray-800 dark:text-dark-text">AI Chat</span>
        </div>

        <nav className="flex-1 px-2 overflow-y-auto custom-scrollbar">
          {/* Nav Items */}
          <div className="space-y-1 mb-4">
            {navItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#ececec] dark:hover:bg-[#2b2c2d] text-gray-700 dark:text-gray-300 transition-colors">
                {item.icon} <span className="text-[14px]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* New Chat */}
          <button 
            onClick={() => { onNewChat(); if(window.innerWidth < 768) setIsOpen(false); }} 
            className="mb-6 w-full flex items-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-dark-bg hover:bg-gray-50 dark:hover:bg-dark-sidebar dark:text-white transition-all text-[14px] font-medium shadow-sm"
          >
            <Plus size={16} className="text-[#1a73e8]" /> New chat
          </button>

          {/* History List */}

<div className="mt-4 px-3">
  <h3 className="text-[12px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-3">Recent Chat</h3>
  <div className="space-y-1 pb-10">
    {localHistory.map((chat) => (
      <div 
        key={chat.id} 
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[16px] transition-colors ${
          activeId === chat.id 
            ? "bg-[#e1e3e1] dark:bg-[#333537] text-gray-900 dark:text-white font-semibold" 
            : "hover:bg-[#ececec] dark:hover:bg-[#2b2c2d] text-gray-600 dark:text-gray-300"
        }`}
        onClick={() => { onSelect(chat.id); if(window.innerWidth < 768) setIsOpen(false); }}
      >
        <MessageSquare size={14} className="shrink-0" />
        
        <span className="truncate flex-1 pr-8">{chat.title || "Untitled Chat"}</span>

        {/* Dot Button - Visible on Mobile, Hover on Desktop */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => openChatOptions(e, chat)}
            className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
        </nav>
        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
           <div className="space-y-1 mb-4 px-2">
              <div className="flex items-center gap-4 px-3 py-1.5 hover:bg-[#ececec] dark:hover:bg-[#2b2c2d] rounded-lg cursor-pointer text-[13px] text-gray-700 dark:text-gray-300"><Snowflake size={16}/> Let it snow</div>
              <div className="flex items-center gap-4 px-3 py-1.5 hover:bg-[#ececec] dark:hover:bg-[#2b2c2d] rounded-lg cursor-pointer text-[13px] text-gray-700 dark:text-gray-300"><Key size={16}/> Get API key</div>
              <div className="flex items-center gap-4 px-3 py-1.5 hover:bg-[#ececec] dark:hover:bg-[#2b2c2d] rounded-lg cursor-pointer text-[13px] text-gray-700 dark:text-gray-300"><Settings size={16}/> Settings</div>
          </div>
          
          <div className="relative">
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#2b2c2d] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-sidebar">
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{user?.username || "Guest"}</p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-[14px] font-medium">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className={`w-full flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all ${showProfileMenu ? 'bg-[#e1e3e1] dark:bg-[#333537]' : 'hover:bg-[#ececec] dark:hover:bg-[#2b2c2d]'}`}>
              <div className="w-8 h-8 rounded-full bg-teal-700 dark:bg-teal-600 flex items-center justify-center text-white text-[14px] font-bold uppercase shrink-0">
                {user?.username?.[0] || 'U'}
              </div>
              <span className="text-[13px] font-medium truncate flex-1 text-left text-gray-700 dark:text-gray-300">{user?.email || "Loading..."}</span>
              <MoreVertical size={14} className="text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- RENDER THE MODALS --- */}
      <ChatModals 
        isOpen={modalOpen} 
        initialType="menu" 
        chat={targetChat} 
        onClose={() => { setModalOpen(false); setTargetChat(null); }}
        onDelete={handleConfirmDelete}
        onRename={handleConfirmRename}
      />
    </>
  );
}
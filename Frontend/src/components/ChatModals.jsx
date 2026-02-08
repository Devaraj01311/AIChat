import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Edit2, AlertTriangle, ArrowLeft, Check } from "lucide-react";

export default function ChatModals({ 
  isOpen, 
  chat, 
  onClose, 
  onRename, 
  onDelete 
}) {
  const [view, setView] = useState("menu"); 
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView("menu");
      if (chat) setInputValue(chat.title);
    }
  }, [isOpen, chat]);

  if (!isOpen || !chat) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop - blurred background like the plus menu */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
        />

        {/* Compact Menu Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-70 bg-white dark:bg-[#2b2c2d] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          
          {/* --- VIEW: SELECTION MENU --- */}
          {view === "menu" && (
            <div className="p-1.5">
              <div className="px-3 py-2 mb-1 border-b border-gray-100 dark:border-gray-800">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Options</p>
              </div>
              
              <button 
                onClick={() => setView("rename")}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors text-sm font-medium"
              >
                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                  <Edit2 size={16} />
                </div>
                Rename Chat
              </button>

              <button 
                onClick={() => setView("delete")}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-colors text-sm font-medium"
              >
                <div className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                  <Trash2 size={16} />
                </div>
                Delete Chat
              </button>

              <button 
                onClick={onClose}
                className="w-full mt-1 flex items-center justify-center py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          )}

          {/* --- VIEW: RENAME (Compact Input) --- */}
          {view === "rename" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setView("menu")} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500">
                  <ArrowLeft size={16} />
                </button>
                <span className="text-sm font-bold dark:text-gray-200">Rename Chat</span>
              </div>
              
              <input 
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onRename(chat.id, inputValue)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-dark-sidebar border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white mb-4"
              />

              <div className="flex gap-2">
                <button 
                  onClick={() => onRename(chat.id, inputValue)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20"
                >
                  <Check size={16} /> Save
                </button>
              </div>
            </motion.div>
          )}

          {/* --- VIEW: DELETE (Compact Warning) --- */}
          {view === "delete" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-5 text-center">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-sm font-bold dark:text-white mb-1">Delete this chat?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                This will permanently remove your conversation history.
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setView("menu")}
                  className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl"
                >
                  No
                </button>
                <button 
                  onClick={() => onDelete(chat.id)}
                  className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-xl shadow-lg shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Mic, Send, Camera, Youtube, Triangle, FileUp, Image as ImageIcon, X 
} from "lucide-react";

export default function ChatInput({ input, setInput, onSend, loading }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]); 
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);

  // --- AUDIO LOGIC ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, [setInput]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported.");
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // --- TEXTAREA AUTO-RESIZE ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // --- FILE HANDLING ---
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'file'
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setShowMenu(false);
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview); 
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case "drive":
        const driveUrl = window.prompt("Enter Google Drive Link:");
        if (driveUrl) setInput(prev => prev + ` [Drive: ${driveUrl}] `);
        setShowMenu(false);
        break;
      case "upload":
        fileRef.current.click();
        break;
      case "audio":
        toggleVoice();
        setShowMenu(false);
        break;
      case "camera":
        const camInput = document.createElement("input");
        camInput.type = "file";
        camInput.accept = "image/*";
        camInput.capture = "environment"; 
        camInput.onchange = handleFileSelection;
        camInput.click();
        setShowMenu(false);
        break;
      case "youtube":
        const ytUrl = window.prompt("Paste YouTube Video URL:");
        if (ytUrl) setInput(prev => prev + ` [YouTube: ${ytUrl}] `);
        setShowMenu(false);
        break;
      case "sample":
        // Simulated media upload
        setAttachedFiles(prev => [...prev, { 
          file: null, 
          preview: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200", 
          type: "image" 
        }]);
        setShowMenu(false);
        break;
      default:
        setShowMenu(false);
        break;
    }
  };

  const handleSend = () => {
    if ((input.trim() || attachedFiles.length > 0) && !loading) {
      // Pass both input text and files to the parent onSend function
      onSend(input, attachedFiles); 
      setInput("");
      setAttachedFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const menuItems = [
    { id: "drive", icon: <Triangle size={15} />, label: "Drive" },
    { id: "upload", icon: <FileUp size={15} />, label: "Upload" },
    { id: "audio", icon: <Mic size={15} />, label: "Audio" },
    { id: "camera", icon: <Camera size={15} />, label: "Camera" },
    { id: "youtube", icon: <Youtube size={15} />, label: "YouTube" },
    { id: "sample", icon: <ImageIcon size={15} />, label: "Media" },
  ];

  return (
    <div className="px-2 md:px-4 pb-4 md:pb-6 bg-white dark:bg-dark-bg w-full">
      <div className="max-w-4xl mx-auto relative">
        
        {/* INPUT CONTAINER */}
        <div className="flex flex-col bg-white dark:bg-dark-sidebar border border-gray-200 dark:border-gray-700 rounded-[28px] shadow-sm focus-within:ring-1 focus-within:ring-gray-300 overflow-hidden">
          
          {/* FILE PREVIEW AREA */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="relative group w-16 h-16">
                  {file.type === 'image' ? (
                    <img src={file.preview} alt="upload" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">
                      <FileUp size={20} className="text-gray-400" />
                    </div>
                  )}
                  <button 
                    onClick={() => removeFile(idx)}
                    className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-lg hover:bg-black transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-1 md:gap-2 px-2 md:px-4 py-2">
            <input 
              type="file" 
              multiple 
              ref={fileRef} 
              className="hidden" 
              onChange={handleFileSelection} 
            />
              
            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 8, scale: 0.95 }} 
                    className="absolute bottom-full left-4 mb-3 w-36 bg-white dark:bg-[#2b2c2d] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-1"
                  >
                    {menuItems.map((item) => (
                      <button key={item.id} onClick={() => handleMenuAction(item.id)} className="w-full flex items-center gap-3 px-2.5 py-2 hover:bg-[#f0f4f9] dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200">
                        <span className="shrink-0 opacity-70">{item.icon}</span>
                        <span className="text-[12px] font-medium">{item.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <button onClick={() => setShowMenu(!showMenu)} className={`p-2 rounded-full transition-all mb-1 ${showMenu ? 'bg-blue-50 text-blue-600 dark:bg-gray-800' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <Plus size={22} className={showMenu ? 'rotate-45 transition-transform' : 'transition-transform'} />
            </button>
            
            <textarea 
              ref={textareaRef}
              rows="1" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
              placeholder={isRecording ? "Listening..." : "Ask anything"}
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[#1f1f1f] dark:text-dark-text py-3 resize-none text-[16px] max-h-50"
            />
            
            <div className="flex items-center gap-1 mb-1">
              <button 
                onClick={toggleVoice} 
                className={`p-2 rounded-full transition-colors relative ${isRecording ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                 {isRecording && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25"></span>}
                 <Mic size={20} />
              </button>

              <button 
                onClick={handleSend} 
                disabled={loading || (!input.trim() && attachedFiles.length === 0)} 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-opacity ${loading || (!input.trim() && attachedFiles.length === 0) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black dark:bg-dark-text text-white dark:text-black hover:opacity-80'}`}
              >
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-2">
          AI Chat can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
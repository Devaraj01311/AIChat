import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sparkles, Download, FileText, Image as ImageIcon } from "lucide-react";
import StarterCards from './StarterCards';
import MessageActions from './MessageActions';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-5 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-sidebar px-4 py-1.5 border-b border-gray-200 dark:border-gray-800">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{language || 'code'}</span>
        <button onClick={handleCopy} className="text-gray-500 hover:text-blue-500 transition-colors text-[11px] font-medium">
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter 
        language={language || 'text'} 
        style={oneDark} 
        customStyle={{ margin: 0, padding: '1rem', fontSize: '13px', background: '#0d0d0d' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default function MessageArea({ messages, user, loading, scrollRef, onCardClick, onUpdateMessage }) {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  if (messages.length === 0) {
    return <StarterCards onCardClick={onCardClick} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-40">
      <div className="flex flex-col space-y-10">
        {messages.map((m, i) => {
          // Detect if this is an image generation response (Simple Demo Logic)
          const isImageResponse = m.role === 'assistant' && (m.text.toLowerCase().includes("image of") || m.text.toLowerCase().includes("here is"));
          const promptForImage = isImageResponse ? m.text.split('!').pop().trim() : "";

          return (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              <div className={`flex items-center gap-2 mb-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {m.role === 'user' ? 'You' : 'AI Chat Model'}
                </span>
              </div>

              <div className={`w-full flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* 1. DISPLAY USER UPLOADED FILES/IMAGES */}
                {m.role === 'user' && m.attachments && m.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 justify-end">
                    {m.attachments.map((att, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm max-w-62.5">
                        {att.type === 'image' ? (
                          <img src={att.preview} alt="upload" className="w-full h-auto max-h-60 object-cover" />
                        ) : (
                          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800">
                            <FileText className="text-blue-500" size={24} />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-37.5">{att.file?.name}</span>
                              <span className="text-[10px] text-gray-500 uppercase">File</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className={`max-w-[90%] md:max-w-[85%] ${
                  m.role === 'user' 
                  ? 'bg-[#f0f4f9] dark:bg-[#2b2c2d] px-5 py-3 rounded-2xl shadow-sm' 
                  : 'w-full'
                }`}>
                  {editId === i ? (
                    <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-3 border-2 border-blue-500 shadow-lg">
                      <textarea 
                        className="w-full bg-transparent dark:text-white p-1 outline-none resize-none text-[15px]" 
                        rows={3} 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditId(null)} className="text-xs px-3 py-1.5 text-gray-500 font-medium">Cancel</button>
                        <button onClick={() => { onUpdateMessage(i, editText); setEditId(null); }} className="text-xs px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium">Update</button>
                      </div>
                    </div>
                  ) : (
                    <div className={`prose prose-sm md:prose-base dark:prose-invert max-w-none ${m.role === 'user' ? 'text-gray-800 dark:text-gray-100' : ''}`}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          //RENDER MARKDOWN IMAGES WITH DOWNLOAD BUTTON
                          img({ node, ...props }) {
                            return (
                              <div className="relative group my-4 inline-block">
                                <img {...props} className="rounded-2xl border border-gray-200 dark:border-gray-800 max-w-full h-auto shadow-lg" alt="AI Generated" />
                                <button 
                                  onClick={() => downloadImage(props.src)}
                                  className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-black/70 hover:scale-110 text-gray-800 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl backdrop-blur-md"
                                >
                                  <Download size={20} />
                                </button>
                              </div>
                            );
                          },
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                            ) : (
                              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-pink-500 font-mono text-sm" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>

                      {/* 3. AUTO-GENERATE IMAGE IF TEXT DESCRIBES ONE */}
                      {isImageResponse && !m.text.includes("![") && (
                        <div className="relative group mt-4 inline-block">
                           <img 
                            src={`https://image.pollinations.ai/prompt/${encodeURIComponent(promptForImage)}?width=1024&height=1024&nologo=true`} 
                            alt="Generated" 
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg max-w-full h-auto"
                            onLoad={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
                           />
                           <button 
                             onClick={() => downloadImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(promptForImage)}`)}
                             className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                           >
                             <Download size={20} />
                           </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={`mt-1 transition-opacity ${editId === i ? 'hidden' : 'block'}`}>
                  <MessageActions 
                    role={m.role} 
                    text={m.text} 
                    onEdit={() => { setEditId(i); setEditText(m.text); }} 
                  />
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                <Sparkles size={14} className="text-white" fill="white" />
              </div>
              <span className="text-xs font-medium text-gray-400">Thinking...</span>
            </div>
            <div className="space-y-2 w-full max-w-[70%]">
              <div className="h-3 bg-gray-100 dark:bg-[#2b2c2d] rounded-full animate-pulse w-full"></div>
              <div className="h-3 bg-gray-100 dark:bg-[#2b2c2d] rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-10" />
      </div>
    </div>
  );
}
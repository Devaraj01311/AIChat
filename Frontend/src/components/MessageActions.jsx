import React, { useState } from 'react';
import { 
  Copy, Check, ThumbsUp, ThumbsDown, 
  Share2, RotateCcw, MoreHorizontal, Pencil 
} from "lucide-react";

const MessageActions = ({ role, text, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 mt-2 px-1 text-gray-400 dark:text-gray-500">
      {/* Copy Button - Available for both roles */}
      <button 
        onClick={handleCopy} 
        title="Copy" 
        className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>

      {role === 'user' ? (
        /* User Specific Actions */
        <button 
          onClick={onEdit} 
          title="Edit message" 
          className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Pencil size={16} />
        </button>
      ) : (
        /* AI Specific Actions */
        <>
          <button 
            onClick={() => setFeedback('like')} 
            className={`hover:text-gray-600 transition-colors ${feedback === 'like' ? 'text-blue-500' : ''}`}
          >
            <ThumbsUp size={16} />
          </button>
          <button 
            onClick={() => setFeedback('dislike')} 
            className={`hover:text-gray-600 transition-colors ${feedback === 'dislike' ? 'text-red-500' : ''}`}
          >
            <ThumbsDown size={16} />
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Share">
            <Share2 size={16} />
          </button>
          <button className="hover:text-gray-600 transition-colors" title="Regenerate">
            <RotateCcw size={16} />
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default MessageActions;
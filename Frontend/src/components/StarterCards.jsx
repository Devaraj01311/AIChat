import React from 'react';
import { Sparkles, Code2, FileText, PenLine, Lightbulb } from "lucide-react";

const StarterCards = ({ onCardClick }) => {
  const cards = [
    {
      icon: <Code2 className="text-blue-600 dark:text-blue-400" size={20} />,
      title: "Help me code",
      desc: "Write a script or debug a logic error"
    },
    {
      icon: <FileText className="text-orange-500 dark:text-orange-400" size={20} />,
      title: "Summarize text",
      desc: "Get the key points from a long article"
    },
    {
      icon: <PenLine className="text-green-600 dark:text-green-400" size={20} />,
      title: "Write an email",
      desc: "Draft a professional response quickly"
    },
    {
      icon: <Lightbulb className="text-yellow-500 dark:text-yellow-400" size={20} />,
      title: "Brainstorm ideas",
      desc: "Generate creative concepts for a project"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12 flex flex-col items-center justify-center min-h-[80vh] transition-colors duration-300">
      <div className="text-center mb-8 md:mb-12">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f0f4f9] dark:bg-dark-sidebar rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm border border-blue-50 dark:border-gray-800">
          <Sparkles size={24} className="text-[#1a73e8]" fill="#1a73e8" />
        </div>
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-dark-text mb-2 md:mb-3 tracking-tight">
          How can I help you today?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
          Select a prompt or type your own.
        </p>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            onClick={() => onCardClick(card.title)}
            className="p-4 md:p-5 bg-white dark:bg-dark-sidebar border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-[#f0f4f9] dark:hover:bg-[#2b2c2d] hover:border-[#1a73e8]/30 dark:hover:border-blue-500/30 cursor-pointer transition-all group active:scale-[0.98] shadow-sm"
          >
            <div className="mb-2 md:mb-3">{card.icon}</div>
            <h4 className="text-[14px] md:text-[15px] font-semibold text-gray-800 dark:text-gray-200 mb-1">{card.title}</h4>
            <p className="text-[12px] md:text-[13px] text-gray-500 dark:text-gray-400 leading-snug">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarterCards;
import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Visual<span className="text-indigo-600">Notes</span> AI
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <span className="hidden sm:flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Powered by Gemini & Flux AI</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

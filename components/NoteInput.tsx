import React from 'react';
import { Wand2 } from 'lucide-react';

interface NoteInputProps {
  notes: string;
  setNotes: (notes: string) => void;
  onVisualize: () => void;
  isProcessing: boolean;
}

const NoteInput: React.FC<NoteInputProps> = ({ notes, setNotes, onVisualize, isProcessing }) => {
  const charCount = notes.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Your Notes</h2>
        <span className="text-xs text-slate-400 font-mono">{charCount} chars</span>
      </div>
      
      <div className="p-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your study notes, article, or concept here... (e.g., 'The water cycle process involving evaporation, condensation, and precipitation...')"
          className="w-full h-48 p-4 text-slate-700 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none focus:bg-white outline-none text-base leading-relaxed"
          disabled={isProcessing}
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onVisualize}
            disabled={!notes.trim() || isProcessing}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${!notes.trim() || isProcessing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5'
              }
            `}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate Visuals</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteInput;

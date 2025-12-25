
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import NoteInput from './components/NoteInput';
import ImageGrid from './components/ImageGrid';
import { analyzeNotes, generateProImage } from './services/gemini';
import { VisualConcept, GeneratedImage, AppStatus } from './types';
import { LayoutGrid, AlertTriangle, CheckCircle2, Key, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [concepts, setConcepts] = useState<VisualConcept[]>([]);
  const [images, setImages] = useState<Record<number, GeneratedImage>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleVisualize = useCallback(async () => {
    if (!notes.trim()) return;
    
    // Check key again before starting
    const selected = await window.aistudio.hasSelectedApiKey();
    if (!selected) {
      await handleSelectKey();
      return;
    }

    try {
      setStatus('analyzing');
      setGlobalError(null);
      setConcepts([]);
      setImages({});

      // 1. Analyze to get dynamic concepts
      const analyzedConcepts = await analyzeNotes(notes);
      setConcepts(analyzedConcepts);
      
      // Init loading states
      const initialStates: Record<number, GeneratedImage> = {};
      analyzedConcepts.forEach(c => initialStates[c.id] = { id: c.id, loading: true });
      setImages(initialStates);
      
      setStatus('generating');

      // 2. Generate Pro Images (High Quality)
      const imagePromises = analyzedConcepts.map(async (concept, index) => {
        // Stagger to prevent overwhelming the Pro model
        await new Promise(r => setTimeout(r, index * 1200));
        
        try {
          const base64 = await generateProImage(concept.imagePrompt);
          setImages(prev => ({
            ...prev,
            [concept.id]: { id: concept.id, loading: false, base64 }
          }));
        } catch (err: any) {
          if (err.message === "KEY_RESET_REQUIRED") {
            setGlobalError("API Key session expired or invalid. Please re-select your key.");
            setHasKey(false);
          }
          setImages(prev => ({
            ...prev,
            [concept.id]: { id: concept.id, loading: false, error: "Failed" }
          }));
        }
      });

      await Promise.all(imagePromises);
      setStatus('completed');

    } catch (error: any) {
      setGlobalError(error.message || "An unexpected error occurred.");
      setStatus('error');
    }
  }, [notes]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Step 0: Key Selection Required UI */}
        {!hasKey && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border-2 border-dashed border-indigo-200 text-center space-y-6 shadow-sm animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <Key className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">High-Quality Generation Ready</h2>
              <p className="text-slate-600">
                To use the Gemini 3 Pro Image model for realistic visuals, you must select a paid API key from a Google Cloud project.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleSelectKey}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                Select API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
              >
                Learn about billing <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Input Section */}
        {hasKey && (
          <section className="max-w-3xl mx-auto w-full transition-all duration-500">
            <div className="mb-6 text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Visualize your notes with Pro AI
              </h2>
              <p className="text-lg text-slate-600">
                AI will decide the best number of realistic visuals to explain your concepts.
              </p>
            </div>
            
            <NoteInput 
              notes={notes} 
              setNotes={setNotes} 
              onVisualize={handleVisualize} 
              isProcessing={status === 'analyzing'}
            />
            
            {globalError && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm opacity-90">{globalError}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Results Section */}
        {hasKey && (status !== 'idle' && (status === 'generating' || status === 'completed' || concepts.length > 0)) && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center space-x-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Visual Guide: <span className="text-indigo-600">{concepts.length} Realistic Concepts</span>
                </h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {status === 'generating' && (
                  <span className="text-sm text-indigo-600 font-medium animate-pulse flex items-center bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    Generating high-res photos...
                  </span>
                )}
                {status === 'completed' && (
                  <span className="text-sm text-emerald-600 font-medium flex items-center bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Pro visuals ready
                  </span>
                )}
              </div>
            </div>
            
            <ImageGrid concepts={concepts} images={images} />
          </section>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} VisualNotes Pro • Powered by Nano Banana Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

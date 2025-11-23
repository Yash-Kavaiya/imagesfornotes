import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import NoteInput from './components/NoteInput';
import ImageGrid from './components/ImageGrid';
import { analyzeNotes, generateImageForConcept } from './services/gemini';
import { VisualConcept, GeneratedImage, AppStatus } from './types';
import { LayoutGrid, AlertTriangle, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [concepts, setConcepts] = useState<VisualConcept[]>([]);
  const [images, setImages] = useState<Record<number, GeneratedImage>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleRegenerate = useCallback(async (conceptId: number, comment?: string) => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return;

    // Set loading state for this specific image
    setImages(prev => ({
      ...prev,
      [conceptId]: { id: conceptId, loading: true }
    }));

    try {
      // Modify the prompt with the comment if provided
      const modifiedPrompt = comment 
        ? `${concept.imagePrompt}. Additional instructions: ${comment}`
        : concept.imagePrompt;
      
      const base64 = await generateImageForConcept(modifiedPrompt);
      setImages(prev => ({
        ...prev,
        [conceptId]: { id: conceptId, loading: false, base64 }
      }));
    } catch (err) {
      console.error(`Failed to regenerate image for concept ${conceptId}`, err);
      setImages(prev => ({
        ...prev,
        [conceptId]: { id: conceptId, loading: false, error: "Generation failed" }
      }));
    }
  }, [concepts]);

  const handleVisualize = useCallback(async () => {
    if (!notes.trim()) return;

    try {
      setStatus('analyzing');
      setGlobalError(null);
      setConcepts([]);
      setImages({});

      // Step 1: Analyze text and get concepts
      const analyzedConcepts = await analyzeNotes(notes);
      
      if (analyzedConcepts.length === 0) {
        throw new Error("Could not extract concepts from the notes. Try adding more detail.");
      }

      setConcepts(analyzedConcepts);
      
      // Initialize image states with loading
      const initialImageStates: Record<number, GeneratedImage> = {};
      analyzedConcepts.forEach(c => {
        initialImageStates[c.id] = { id: c.id, loading: true };
      });
      setImages(initialImageStates);
      
      setStatus('generating');

      // Step 2: Generate images with simple concurrency control
      const imagePromises = analyzedConcepts.map(async (concept, index) => {
        // Stagger requests slightly (500ms) to avoid hitting burst rate limits and allow UI to update smoothly
        await new Promise(resolve => setTimeout(resolve, index * 500));

        try {
          const base64 = await generateImageForConcept(concept.imagePrompt);
          setImages(prev => ({
            ...prev,
            [concept.id]: { id: concept.id, loading: false, base64 }
          }));
        } catch (err) {
          console.error(`Failed to generate image for concept ${concept.id}`, err);
          setImages(prev => ({
            ...prev,
            [concept.id]: { id: concept.id, loading: false, error: "Generation failed" }
          }));
        }
      });

      // Wait for all images to finish (success or fail) before setting status to completed
      await Promise.all(imagePromises);
      setStatus('completed');

    } catch (error: any) {
      console.error(error);
      setGlobalError(error.message || "Something went wrong while analyzing the notes.");
      setStatus('error');
    }
  }, [notes]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Input Section */}
        <section className="max-w-3xl mx-auto w-full">
          <div className="mb-6 text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Visualize your thoughts
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Paste your notes below. We'll use AI to break them down into 6 key concepts and generate high-quality explanatory visuals for each.
            </p>
          </div>
          
          <NoteInput 
            notes={notes} 
            setNotes={setNotes} 
            onVisualize={handleVisualize} 
            isProcessing={status === 'analyzing'}
          />
          
          {globalError && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm opacity-90">{globalError}</p>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {(status === 'generating' || status === 'completed' || concepts.length > 0) && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <LayoutGrid className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-semibold text-slate-900">Generated Visuals</h3>
              </div>
              
              <div className="flex items-center space-x-2">
                {status === 'generating' && (
                  <span className="text-sm text-indigo-600 font-medium animate-pulse flex items-center">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
                    Generating visuals...
                  </span>
                )}
                {status === 'completed' && (
                  <span className="text-sm text-emerald-600 font-medium flex items-center animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complete
                  </span>
                )}
              </div>
            </div>
            
            <ImageGrid concepts={concepts} images={images} onRegenerate={handleRegenerate} />
          </section>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} VisualNotes AI. Generated images are for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
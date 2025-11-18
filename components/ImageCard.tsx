import React from 'react';
import { VisualConcept, GeneratedImage } from '../types';
import { Image as ImageIcon, Loader2, AlertCircle, Download } from 'lucide-react';

interface ImageCardProps {
  concept: VisualConcept;
  imageState: GeneratedImage;
  onRetry?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ concept, imageState }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container with strict aspect ratio enforcement */}
      <div 
        className="relative w-full bg-slate-100 overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        {imageState.loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 animate-pulse">Creating Visual</span>
          </div>
        ) : imageState.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-500 p-6 text-center bg-rose-50/50">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Generation failed</p>
          </div>
        ) : imageState.base64 ? (
          <>
            <img 
              src={imageState.base64} 
              alt={concept.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Overlay Actions */}
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
              <a 
                href={imageState.base64} 
                download={`visual-note-${concept.id}.jpg`}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-slate-700 shadow-sm hover:shadow-md transition-all"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow border-t border-slate-100">
        <div className="flex items-center space-x-2 mb-3">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {concept.id + 1}
            </span>
            <h3 className="font-bold text-slate-800 line-clamp-1" title={concept.title}>
              {concept.title}
            </h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow">
          {concept.description}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
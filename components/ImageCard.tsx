
import React from 'react';
import { VisualConcept, GeneratedImage } from '../types';
import { Image as ImageIcon, Loader2, AlertCircle, Download } from 'lucide-react';

interface ImageCardProps {
  concept: VisualConcept;
  imageState: GeneratedImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ concept, imageState }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
      {/* Cinematic 16:9 Aspect Ratio */}
      <div 
        className="relative w-full bg-slate-100 overflow-hidden"
        style={{ aspectRatio: '16/9' }}
      >
        {imageState.loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-3 bg-slate-50">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 stroke-[1.5]" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Developing Photo</span>
          </div>
        ) : imageState.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-500 p-6 text-center bg-rose-50/50">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-bold">Pro Generation Failed</p>
            <p className="text-[10px] mt-1 opacity-70">Model may be busy or key invalid</p>
          </div>
        ) : imageState.base64 ? (
          <>
            <img 
              src={imageState.base64} 
              alt={concept.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Actions */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <a 
                href={imageState.base64} 
                download={`pro-visual-${concept.id}.png`}
                className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl hover:bg-white text-slate-900 shadow-xl transition-all"
                title="Save High-Res Image"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>

            {/* Title Overlay on Hover */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <span className="px-2 py-1 bg-indigo-600 text-[10px] font-black text-white rounded uppercase tracking-tighter mb-1 inline-block">Pro Render</span>
               <h4 className="text-white font-bold text-lg drop-shadow-lg">{concept.title}</h4>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow border-t border-slate-100">
        <div className="flex items-center space-x-3 mb-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-black shadow-lg">
                {String(concept.id + 1).padStart(2, '0')}
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
              {concept.title}
            </h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 flex-grow font-medium">
          {concept.description}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;

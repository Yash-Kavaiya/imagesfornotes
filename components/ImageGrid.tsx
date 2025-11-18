import React from 'react';
import { VisualConcept, GeneratedImage } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  concepts: VisualConcept[];
  images: Record<number, GeneratedImage>;
}

const ImageGrid: React.FC<ImageGridProps> = ({ concepts, images }) => {
  if (concepts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {concepts.map((concept) => (
        <div key={concept.id} className="h-full">
          <ImageCard 
            concept={concept} 
            imageState={images[concept.id] || { id: concept.id, loading: true }} 
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;

export interface VisualConcept {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
}

export interface GeneratedImage {
  id: number;
  base64?: string;
  loading: boolean;
  error?: string;
}

export type AppStatus = 'idle' | 'analyzing' | 'generating' | 'completed' | 'error';

<div align="center">
<img width="1200" height="475" alt="VisualNotes AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# VisualNotes AI

**Transform your text notes into a gallery of 6 explanatory visuals using generative AI**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[View Demo](https://ai.studio/apps/drive/1t9x4Au-VDEyx3tAF43vLkUdwkmi_AsZB) | [Report Bug](https://github.com/Yash-Kavaiya/imagesfornotes/issues) | [Request Feature](https://github.com/Yash-Kavaiya/imagesfornotes/issues)

</div>

---

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Components](#components)
- [Data Flow](#data-flow)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About The Project

**VisualNotes AI** is a modern web application that leverages the power of generative AI to transform complex text notes into a visually engaging gallery of explanatory images. Perfect for students, educators, researchers, and anyone looking to better understand and remember information through visual learning.

### Why VisualNotes AI?

- **Visual Learning**: Studies show that visual content improves comprehension and retention by up to 65%
- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash to intelligently extract 6 key concepts from your notes
- **High-Quality Images**: Generates stunning visuals using Google Imagen 3.0 with Pollinations.ai fallback
- **No Backend Required**: Runs entirely in your browser for maximum privacy and speed

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Text Analysis** | Extracts 6 key concepts from any text using Gemini AI | ✅ |
| **Image Generation** | Creates high-quality AI visuals for each concept | ✅ |
| **Dual AI Backend** | Primary Imagen 3.0 with Pollinations.ai fallback | ✅ |
| **Image Regeneration** | Refine images with custom instructions/comments | ✅ |
| **Download Images** | Save generated visuals to your device | ✅ |
| **Responsive Design** | Works seamlessly on mobile, tablet, and desktop | ✅ |
| **Real-time Feedback** | Live status updates during analysis and generation | ✅ |
| **Error Recovery** | Automatic retry and fallback mechanisms | ✅ |
| **Character Counter** | Live character count for input validation | ✅ |
| **Loading States** | Per-image loading indicators for better UX | ✅ |

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VISUALNOTES AI                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        PRESENTATION LAYER                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Header    │  │  NoteInput  │  │  ImageGrid  │  │  ImageCard  │  │   │
│  │  │  Component  │  │  Component  │  │  Component  │  │  Component  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      APPLICATION LAYER (App.tsx)                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │                      State Management                           │  │   │
│  │  │  • notes: string          • status: AppStatus                  │  │   │
│  │  │  • concepts: Concept[]    • images: Record<id, GeneratedImage> │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                       SERVICE LAYER (gemini.ts)                       │   │
│  │  ┌─────────────────────┐      ┌─────────────────────────────────┐   │   │
│  │  │   analyzeNotes()    │      │   generateImageForConcept()     │   │   │
│  │  │   Gemini 2.5 Flash  │      │   Imagen 3.0 → Pollinations.ai  │   │   │
│  │  └─────────────────────┘      └─────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
└────────────────────────────────────┼─────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL AI SERVICES                               │
│  ┌─────────────────────────┐          ┌─────────────────────────────────┐   │
│  │     Google Gemini       │          │       Image Generation          │   │
│  │     2.5 Flash API       │          │  ┌─────────────────────────┐   │   │
│  │  ┌───────────────────┐  │          │  │   Google Imagen 3.0    │   │   │
│  │  │ Text → 6 Concepts │  │          │  │      (Primary)         │   │   │
│  │  │ Structured Output │  │          │  └───────────┬─────────────┘   │   │
│  │  └───────────────────┘  │          │              │ fallback        │   │
│  └─────────────────────────┘          │  ┌───────────▼─────────────┐   │   │
│                                       │  │   Pollinations.ai      │   │   │
│                                       │  │      (Flux Model)      │   │   │
│                                       │  └─────────────────────────┘   │   │
│                                       └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Application Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│    User     │     │   NoteInput  │     │    App.tsx    │     │  gemini.ts   │
│   Input     │────▶│   Component  │────▶│   (State)     │────▶│   Service    │
└─────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
                                                │                      │
                                                │    analyzeNotes()    │
                                                │─────────────────────▶│
                                                │                      │
                                                │                      ▼
                                                │              ┌───────────────┐
                                                │              │ Gemini 2.5    │
                                                │              │ Flash API     │
                                                │              └───────────────┘
                                                │                      │
                                                │◀─────────────────────│
                                                │    6 VisualConcepts  │
                                                │                      │
                          ┌─────────────────────┼──────────────────────┘
                          │                     │
                          ▼                     │
                 ┌────────────────┐            │ generateImageForConcept()
                 │   ImageGrid    │            │ (6 parallel calls)
                 │   Component    │            │─────────────────────▶
                 └────────────────┘            │
                          │                    │              ┌───────────────┐
                          ▼                    │              │ Imagen 3.0 /  │
                 ┌────────────────┐            │              │ Pollinations  │
                 │   ImageCard    │◀───────────┘              └───────────────┘
                 │   Component    │                                  │
                 └────────────────┘◀─────────────────────────────────┘
                          │                    6 Base64 Images
                          ▼
                 ┌────────────────┐
                 │   User Views   │
                 │   Downloads    │
                 │   Regenerates  │
                 └────────────────┘
```

---

## Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Component Framework |
| **TypeScript** | 5.8.2 | Static Type Checking |
| **Vite** | 6.2.0 | Build Tool & Dev Server |
| **Tailwind CSS** | CDN | Utility-First CSS Framework |
| **Lucide React** | 0.554.0 | Icon Library |

### AI & APIs

| Service | Model/Version | Purpose |
|---------|---------------|---------|
| **Google Gemini** | 2.5 Flash | Text Analysis & Concept Extraction |
| **Google Imagen** | 3.0 | Primary Image Generation |
| **Pollinations.ai** | Flux | Fallback Image Generation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Node.js** | JavaScript Runtime |
| **npm** | Package Manager |
| **@vitejs/plugin-react** | React Plugin for Vite |
| **@types/node** | TypeScript Node.js Definitions |

### Deployment

| Platform | Purpose |
|----------|---------|
| **Netlify** | Hosting & CDN |

---

## Project Structure

```
imagesfornotes/
├── 📁 components/                 # React UI Components
│   ├── Header.tsx                 # App header with branding
│   ├── NoteInput.tsx              # Text input form component
│   ├── ImageGrid.tsx              # Responsive 3-column grid layout
│   └── ImageCard.tsx              # Individual visual card with actions
│
├── 📁 services/                   # API Integration Layer
│   └── gemini.ts                  # Gemini AI & Image generation service
│
├── 📄 App.tsx                     # Main application component
├── 📄 index.tsx                   # React entry point
├── 📄 index.html                  # HTML template with Tailwind CDN
├── 📄 types.ts                    # TypeScript type definitions
│
├── 📄 package.json                # Dependencies & npm scripts
├── 📄 tsconfig.json               # TypeScript configuration
├── 📄 vite.config.ts              # Vite bundler configuration
├── 📄 netlify.toml                # Netlify deployment config
├── 📄 .env                        # Environment variables template
├── 📄 .gitignore                  # Git ignore patterns
├── 📄 metadata.json               # Application metadata
└── 📄 README.md                   # Project documentation
```

### File Descriptions

| File | Lines | Description |
|------|-------|-------------|
| `App.tsx` | 178 | Main orchestration component managing app state and workflow |
| `ImageCard.tsx` | 156 | Complex UI component with image display, download, and regenerate |
| `gemini.ts` | 135 | AI service layer handling Gemini analysis and image generation |
| `NoteInput.tsx` | 60 | Text input form with character counter and validation |
| `ImageGrid.tsx` | 29 | Responsive grid wrapper for image cards |
| `Header.tsx` | 27 | Application header with title and AI attribution |
| `types.ts` | 20 | TypeScript interfaces and type definitions |
| `index.tsx` | 14 | React DOM entry point |

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-Kavaiya/imagesfornotes.git
   cd imagesfornotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |

---

## Usage

### Basic Workflow

1. **Enter Your Notes**
   - Paste or type your text content into the input area
   - The character counter shows your current input length

2. **Generate Visuals**
   - Click the "Generate Visuals" button
   - Watch as the AI analyzes your text (status: "Analyzing...")
   - See images generate one by one (status: "Generating...")

3. **View Results**
   - Browse your 6 generated visual concepts
   - Each card shows the concept title, description, and generated image

4. **Download or Regenerate**
   - Click the download button to save any image
   - Click regenerate to create a new version with optional instructions

### Example Use Cases

| Use Case | Input Example | Result |
|----------|---------------|--------|
| **Study Notes** | Biology chapter on cell division | 6 visuals showing mitosis stages |
| **Meeting Notes** | Project planning discussion | 6 visuals of key project milestones |
| **Research Summary** | Abstract of scientific paper | 6 visuals illustrating main findings |
| **Learning Languages** | Vocabulary list with contexts | 6 visual memory aids |
| **Recipe Instructions** | Cooking procedure text | 6 step-by-step cooking visuals |

---

## API Reference

### Service Functions

#### `analyzeNotes(notes: string): Promise<VisualConcept[]>`

Analyzes text input and extracts 6 key visual concepts.

| Parameter | Type | Description |
|-----------|------|-------------|
| `notes` | `string` | The text content to analyze |

**Returns:** `Promise<VisualConcept[]>` - Array of 6 concept objects

```typescript
interface VisualConcept {
  id: number;           // Unique identifier (1-6)
  title: string;        // Short catchy title (2-4 words)
  description: string;  // Brief explanation of concept
  imagePrompt: string;  // Detailed prompt for image generation
}
```

---

#### `generateImageForConcept(prompt: string): Promise<string>`

Generates an AI image based on the provided prompt.

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `string` | Detailed image description |

**Returns:** `Promise<string>` - Base64-encoded image data

**Fallback Strategy:**
1. First attempts Google Imagen 3.0
2. Falls back to Pollinations.ai (Flux) on failure

---

### Type Definitions

```typescript
// Visual concept extracted from notes
interface VisualConcept {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
}

// Generated image data
interface GeneratedImage {
  id: number;
  base64?: string;      // Base64 encoded image data
  loading: boolean;     // Loading state indicator
  error?: string;       // Error message if failed
}

// Application status states
type AppStatus = 'idle' | 'analyzing' | 'generating' | 'completed' | 'error';

// Options for regenerating an image
interface RegenerateOptions {
  conceptId: number;
  additionalComment?: string;
}
```

---

## Components

### Component Hierarchy

```
App.tsx (Root)
├── Header.tsx
├── NoteInput.tsx
└── ImageGrid.tsx
    └── ImageCard.tsx (×6)
```

### Component Details

| Component | Props | State | Description |
|-----------|-------|-------|-------------|
| **App** | - | `notes`, `status`, `concepts`, `images`, `globalError` | Main orchestrator managing all state |
| **Header** | - | - | Static header with title and AI attribution |
| **NoteInput** | `notes`, `onChange`, `onSubmit`, `disabled` | - | Controlled text input with submit button |
| **ImageGrid** | `concepts`, `images`, `onRegenerate` | - | Responsive grid container |
| **ImageCard** | `concept`, `image`, `onRegenerate` | `showCommentBox`, `comment` | Individual card with image actions |

### Component State Flow

```
                         App.tsx
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐      ┌───────────┐      ┌───────────┐
    │ Header  │      │ NoteInput │      │ ImageGrid │
    │ (none)  │      │ (props)   │      │ (props)   │
    └─────────┘      └───────────┘      └───────────┘
                           │                  │
                           │                  ▼
                     onChange()         ┌───────────┐
                     onSubmit()         │ ImageCard │
                           │            │ (local)   │
                           ▼            └───────────┘
                      App State              │
                      Updated          onRegenerate()
                                             │
                                             ▼
                                        App State
                                        Updated
```

---

## Data Flow

### Complete Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW                                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STEP 1: USER INPUT                                                        │
│  ─────────────────                                                         │
│  User enters notes → NoteInput onChange → App setState(notes)              │
│                                                                             │
│  STEP 2: TRIGGER ANALYSIS                                                  │
│  ────────────────────────                                                  │
│  User clicks "Generate" → NoteInput onSubmit → App handleVisualize()       │
│                                                                             │
│  STEP 3: CONCEPT EXTRACTION                                                │
│  ─────────────────────────                                                 │
│  App setState(status: 'analyzing')                                         │
│       │                                                                     │
│       ▼                                                                     │
│  analyzeNotes(notes)                                                       │
│       │                                                                     │
│       ▼                                                                     │
│  Gemini 2.5 Flash API                                                      │
│       │                                                                     │
│       ▼                                                                     │
│  Returns: VisualConcept[6] {id, title, description, imagePrompt}           │
│       │                                                                     │
│       ▼                                                                     │
│  App setState(concepts)                                                    │
│                                                                             │
│  STEP 4: IMAGE GENERATION (Parallel with 500ms stagger)                    │
│  ───────────────────────────────────────────────────────                   │
│  App setState(status: 'generating')                                        │
│  App setState(images: {1: {loading: true}, 2: {loading: true}, ...})       │
│       │                                                                     │
│       ├─── [0ms]   generateImageForConcept(concept[0].imagePrompt)         │
│       ├─── [500ms] generateImageForConcept(concept[1].imagePrompt)         │
│       ├─── [1000ms] generateImageForConcept(concept[2].imagePrompt)        │
│       ├─── [1500ms] generateImageForConcept(concept[3].imagePrompt)        │
│       ├─── [2000ms] generateImageForConcept(concept[4].imagePrompt)        │
│       └─── [2500ms] generateImageForConcept(concept[5].imagePrompt)        │
│                 │                                                          │
│                 ▼                                                          │
│        ┌───────────────────┐                                               │
│        │   Imagen 3.0      │◄─── Primary                                   │
│        └─────────┬─────────┘                                               │
│                  │ failure                                                 │
│                  ▼                                                         │
│        ┌───────────────────┐                                               │
│        │ Pollinations.ai   │◄─── Fallback                                  │
│        └─────────┬─────────┘                                               │
│                  │                                                         │
│                  ▼                                                         │
│        Returns: base64 image data                                          │
│                  │                                                         │
│                  ▼                                                         │
│  App setState(images[id]: {base64: data, loading: false})                  │
│                                                                             │
│  STEP 5: COMPLETION                                                        │
│  ─────────────────                                                         │
│  All images loaded → App setState(status: 'completed')                     │
│       │                                                                     │
│       ▼                                                                     │
│  ImageGrid renders with ImageCard components                               │
│                                                                             │
│  STEP 6: USER ACTIONS (Optional)                                           │
│  ───────────────────────────────                                           │
│  Download: ImageCard creates blob → triggers download                      │
│  Regenerate: ImageCard → App handleRegenerate() → Step 4 (single image)    │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### State Transitions

```
┌──────────┐    handleVisualize()    ┌───────────────┐
│   IDLE   │ ──────────────────────▶ │   ANALYZING   │
└──────────┘                         └───────────────┘
     ▲                                      │
     │                        concepts returned
     │                                      │
     │                                      ▼
     │        reset()              ┌───────────────┐
     └─────────────────────────────│  GENERATING   │
     │                             └───────────────┘
     │                                      │
     │                         all images loaded
     │                                      │
     │                                      ▼
     │                             ┌───────────────┐
     │                             │   COMPLETED   │
     │                             └───────────────┘
     │                                      │
     │              error at any step       │
     │                    │                 │
     │                    ▼                 │
     │              ┌───────────┐          │
     └──────────────│   ERROR   │◀─────────┘
                    └───────────┘
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |

### Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

### TypeScript Configuration (`tsconfig.json`)

| Setting | Value | Purpose |
|---------|-------|---------|
| `target` | ES2022 | Modern JavaScript output |
| `module` | ESNext | ES Modules |
| `jsx` | react-jsx | React 17+ JSX transform |
| `strict` | true | Full type checking |
| `moduleResolution` | bundler | Vite-compatible resolution |

---

## Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your GitHub repository to Netlify

2. **Configure Build Settings**
   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Publish directory | `dist` |

3. **Set Environment Variables**
   - Add `GEMINI_API_KEY` in Netlify dashboard

4. **Deploy**
   - Automatic deployment on push to main branch

### Manual Deployment

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# Deploy dist/ folder to your hosting provider
```

---

## Error Handling

### Error Recovery Strategy

| Error Type | Handling Approach |
|------------|-------------------|
| Network Failure | Retry with exponential backoff |
| Gemini API Error | Display user-friendly error message |
| Imagen API Failure | Automatic fallback to Pollinations.ai |
| JSON Parse Error | Log error, return empty/default values |
| Individual Image Failure | Show retry button, don't block others |

### Status Messages

| Status | User Message | Indicator |
|--------|--------------|-----------|
| `idle` | "Enter your notes to begin" | None |
| `analyzing` | "Analyzing your notes..." | Spinner |
| `generating` | "Generating visuals..." | Progress |
| `completed` | "Your visuals are ready!" | Success |
| `error` | "Something went wrong. Please try again." | Error icon |

---

## Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Staggered Requests** | 500ms delay between image generations to avoid rate limits |
| **Parallel Processing** | Multiple images generated concurrently |
| **Lazy Loading** | Images load progressively as they complete |
| **Base64 Images** | No additional network requests for image display |
| **Tailwind CDN** | No CSS build step required |
| **Vite HMR** | Fast hot module replacement in development |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new files
- Follow existing component patterns
- Add proper type definitions
- Keep components focused and single-purpose
- Write descriptive commit messages

---

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI text analysis
- [Google Imagen](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview) - Image generation
- [Pollinations.ai](https://pollinations.ai/) - Fallback image generation
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with AI by [Yash Kavaiya](https://github.com/Yash-Kavaiya)**

If you found this project helpful, please give it a star!

</div>

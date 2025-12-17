# EduBridge - YabvilPrep

## Project Description

EduBridge (YabvilPrep) is an AI-powered educational platform designed specifically for Nigerian students preparing for major examinations including JAMB, WAEC, NECO, POST-UTME, and other standardized tests. The platform provides personalized learning experiences through adaptive AI tutoring, career guidance, collaborative learning features, and comprehensive exam preparation tools.

### Key Features
- **AI-Powered Learning**: Personalized study plans and adaptive learning paths
- **Exam Preparation**: CBT practice for JAMB, WAEC, NECO, POST-UTME, and more
- **Career Assessment**: AI-driven career matching based on interests and strengths
- **Learning Style Detection**: Personalized teaching methods based on individual learning preferences
- **Collaborative Learning**: Peer teaching, study groups, and knowledge sharing
- **Text-to-Speech**: Nigerian voice synthesis for audio learning
- **Study Buddy**: AI companion for motivation and guidance
- **Progress Tracking**: Comprehensive analytics and performance monitoring

## Installation/Run Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd edu-bridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_YARNGPT_API_KEY=your_yarngpt_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router** - Client-side routing and navigation
- **Lucide React** - Beautiful icon library

### AI & APIs
- **Groq API** - Fast AI inference for educational content generation
- **YarnGPT API** - Nigerian voice text-to-speech synthesis
- **Web Speech API** - Browser-based speech synthesis fallback

### State Management
- **React Context** - Theme management and global state
- **Local Storage** - Persistent user data and preferences

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## Team Members

- **Abdulwahab Yusuf** - Developer
- **Salahudeen Mubarak** - Developer

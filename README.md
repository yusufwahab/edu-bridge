# Classence - YabvilPrep

**Empowering Nigerian Students Through AI-Driven Education**

🌐 **Live Demo**: [https://yabvilprep.vercel.app](https://yabvilprep.vercel.app)  
📹 **Video Demo**: [https://youtu.be/8su9TCjSBb4](https://youtu.be/8su9TCjSBb4)  
📊 **Pitch Deck**: [View Presentation](https://drive.google.com/file/d/1V1uXbecOfzcRCoUUMKkT15gHEtANf89I/view?usp=drivesdk)

## Selected SDG

**SDG 4: Quality Education** - Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all. Our solution specifically addresses educational inequality in Nigeria by providing AI-powered personalized learning accessible to students regardless of their location or economic background.

## Project Description

Classence (YabvilPrep) is an AI-powered educational platform designed specifically for Nigerian students preparing for major examinations including JAMB, WAEC, NECO, POST-UTME, BECE, NCEE and other standardized tests. The platform provides personalized learning experiences through adaptive AI tutoring, career guidance, collaborative learning features, and comprehensive exam preparation tools.

### Key Features

- **AI-Powered Learning**: Personalized study plans and adaptive learning paths
- **Exam Preparation**: CBT practice for JAMB, WAEC, NECO, POST-UTME, and more
- **Career Assessment**: AI-driven career matching based on interests and strengths
- **Learning Style Detection**: Personalized teaching methods based on individual learning preferences
- **Collaborative Learning**: Peer teaching, study groups, and knowledge sharing
- **Text-to-Speech**: Nigerian voice synthesis for audio learning
- **Study Buddy**: AI companion for motivation and guidance
- **Progress Tracking**: Comprehensive analytics and performance monitoring

## AI Integration

Our platform leverages cutting-edge AI technologies to create a personalized learning experience:

### 🤖 **Groq API Integration**

- **Intelligent Content Generation**: Creates contextual exam questions, explanations, and study materials
- **Adaptive Learning**: Analyzes student performance to generate personalized study plans
- **Career Guidance**: AI-powered career assessment and matching based on student interests and strengths
- **Real-time Tutoring**: Provides instant explanations and guidance through our Study Buddy feature

### 🎯 **Learning Style Detection**

- **Behavioral Analysis**: AI analyzes student responses to determine optimal learning methods (Visual, Auditory, Kinesthetic, Reading)
- **Adaptive Interface**: Automatically adjusts teaching methods based on detected learning preferences
- **Performance Optimization**: Continuously refines recommendations based on learning outcomes

### 🔊 **Nigerian Voice Synthesis**

- **YarnGPT Integration**: Provides authentic Nigerian voice text-to-speech for audio learning
- **Cultural Relevance**: Ensures educational content resonates with local context and pronunciation
- **Accessibility**: Makes learning accessible to students with different learning needs

### 📊 **Predictive Analytics**

- **Exam Prediction**: AI analyzes past exam patterns to predict likely questions and topics
- **Performance Forecasting**: Predicts student success probability and identifies areas needing improvement
- **Personalized Recommendations**: Suggests optimal study schedules and resource allocation

## Backend Integration

### Base URL
**Production**: `https://edubridge-backend-thgw.onrender.com`  
**Development**: `http://localhost:5000`

### API Endpoints

#### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "agreeTerms": true
}
```
*Response: Automatically sends OTP to email*

**Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get User Profile**
```http
GET /api/user/me
Authorization: Bearer <token>
```

#### Email Verification Endpoints

**Send OTP**
```http
POST /api/verification/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Verify OTP**
```http
POST /api/verification/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Study Pacts Endpoints

**Get All Pacts**
```http
GET /api/pacts
Authorization: Bearer <token>
```

**Create Pact**
```http
POST /api/pacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mathematics Study Session",
  "subject": "Mathematics",
  "duration": 60,
  "scheduledTime": "2024-01-15T18:00:00Z",
  "description": "JAMB Mathematics preparation",
  "difficulty": "Medium"
}
```

**Share Pact**
```http
POST /api/pacts/{id}/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "friend@example.com"
}
```

#### Notifications Endpoints

**Update Notification Settings**
```http
PUT /api/notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "studyReminders": true,
  "emailAlerts": true,
  "smsAlerts": false,
  "whatsappAlerts": true
}
```

**Update Contact Information**
```http
PUT /api/notifications/contact
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "whatsappNumber": "+2348012345678"
}
```

#### Settings Endpoints

**Update Profile**
```http
PUT /api/settings/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "school": "University of Lagos"
}
```

**Update Class Information**
```http
PUT /api/settings/class
Authorization: Bearer <token>
Content-Type: application/json

{
  "gradeLevel": "SS 3",
  "examTarget": "JAMB",
  "subjects": ["Mathematics", "Physics", "Chemistry", "English Language"]
}
```

### Frontend Integration

The frontend uses a centralized API utility (`src/utils/api.js`) that handles:
- **Authentication headers** with JWT tokens
- **Error handling** and response parsing
- **Base URL configuration** via environment variables
- **Consistent request formatting**

#### Key Integration Features:

1. **Automatic OTP Flow**: Registration → OTP sent → Verification → Login
2. **Real-time Notifications**: SMS, Email, and WhatsApp alerts
3. **Study Pacts Sharing**: Email invitations with backend integration
4. **Profile Synchronization**: Dynamic user data across components
5. **Settings Persistence**: All preferences saved to backend

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
   VITE_API_BASE_URL=https://edubridge-backend-thgw.onrender.com
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

- **Abdulwahab Yusuf** - Frontend Developer
- **Salahudeen Mubarak** - AI/ML Engineer

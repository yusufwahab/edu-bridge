import React, { useState, useEffect } from 'react';
import { Brain, Volume2, VolumeX, RefreshCw, Heart, Loader2, Eye, Ear, Hand, BookOpen } from 'lucide-react';

const AdaptiveExplanationEngine = ({ topic, userInterests = [], apiKey }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [learningStyle, setLearningStyle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedExplanations, setSavedExplanations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('learningStyle');
    if (stored) {
      setLearningStyle(JSON.parse(stored));
    }
    
    const saved = localStorage.getItem('savedExplanations');
    if (saved) {
      setSavedExplanations(JSON.parse(saved));
    }
  }, []);

  const stylePrompts = {
    visual: `You are explaining to a VISUAL learner. Use these techniques:
- Start with "Imagine this..." or "Picture this..."
- Use spatial descriptions (above, below, left, right)
- Describe colors, shapes, and visual patterns
- Create mental images and analogies
- Use phrases like "visualize", "see", "picture", "looks like"
- Break into visual steps with clear imagery
- Use Nigerian landmarks/places for spatial references`,

    auditory: `You are explaining to an AUDITORY learner. Use these techniques:
- Start with "Listen to this pattern..." or "Hear how this sounds..."
- Use rhythm, rhymes, and musical analogies
- Include sound-based descriptions
- Use phrases like "sounds like", "listen", "rhythm", "tune"
- Create verbal patterns and repetition
- Use Nigerian songs, music, or sound references
- Encourage reading aloud or discussion`,

    kinesthetic: `You are explaining to a KINESTHETIC learner. Use these techniques:
- Start with "If you were to do this..." or "Feel how this works..."
- Use physical movement and action words
- Describe hands-on activities and experiments
- Use phrases like "hands-on", "feel", "touch", "movement"
- Include real-world physical examples
- Reference Nigerian sports, activities, or physical experiences
- Encourage practice and doing`,

    reading: `You are explaining to a READING/WRITING learner. Use these techniques:
- Start with clear definitions and structured information
- Use numbered lists and organized steps
- Include detailed written descriptions
- Use phrases like "in other words", "defined as", "listed as"
- Provide structured summaries
- Use formal academic language
- Include Nigerian academic or literary references`
  };

  const generateExplanation = async (regenerate = false) => {
    if (!apiKey || !topic || !learningStyle) return;
    
    setLoading(true);
    try {
      const style = learningStyle.dominant;
      const interestsText = userInterests.length > 0 ? userInterests.join(', ') : 'general interests';
      
      const prompt = `${stylePrompts[style]}

Topic to explain: ${topic}
Student interests: ${interestsText}
Context: Nigerian WAEC/JAMB student preparation

Requirements:
1. Explain the topic using ${style} learning techniques
2. Incorporate student interests (${interestsText}) into examples
3. Use Nigerian context (cities, names, situations, currency)
4. Keep it WAEC/JAMB appropriate level
5. Make it engaging and memorable
6. Length: 2-3 paragraphs maximum

${regenerate ? 'Provide a completely different explanation approach than before.' : ''}

Explain: ${topic}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate explanation');

      const data = await response.json();
      const newExplanation = data.choices[0]?.message?.content || 'Unable to generate explanation';
      setExplanation(newExplanation);
      
    } catch (error) {
      setExplanation('Sorry, I couldn\'t generate an explanation right now. Please try again.');
    }
    setLoading(false);
  };

  const speakExplanation = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(explanation);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const saveExplanation = () => {
    const newSaved = {
      id: Date.now(),
      topic,
      explanation,
      learningStyle: learningStyle.dominant,
      timestamp: new Date().toISOString()
    };
    
    const updated = [newSaved, ...savedExplanations.slice(0, 9)]; // Keep last 10
    setSavedExplanations(updated);
    localStorage.setItem('savedExplanations', JSON.stringify(updated));
  };

  const getStyleIcon = (style) => {
    const icons = {
      visual: <Eye className="w-4 h-4" />,
      auditory: <Ear className="w-4 h-4" />,
      kinesthetic: <Hand className="w-4 h-4" />,
      reading: <BookOpen className="w-4 h-4" />
    };
    return icons[style] || <Brain className="w-4 h-4" />;
  };

  const getStyleColor = (style) => {
    const colors = {
      visual: 'from-blue-500 to-cyan-500',
      auditory: 'from-green-500 to-emerald-500',
      kinesthetic: 'from-orange-500 to-red-500',
      reading: 'from-gray-900 via-blue-900 to-indigo-900'
    };
    return colors[style] || 'from-gray-500 to-gray-600';
  };

  useEffect(() => {
    if (topic && learningStyle && apiKey) {
      generateExplanation();
    }
  }, [topic, learningStyle, apiKey]);

  if (!learningStyle) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Please complete the learning style assessment first to get personalized explanations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getStyleColor(learningStyle.dominant)} flex items-center justify-center text-white`}>
            {getStyleIcon(learningStyle.dominant)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Study Buddy AI</h2>
            <p className="text-sm text-gray-600">
              Explaining for {learningStyle.dominant} learners
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateExplanation(true)}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Explain differently"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={speakExplanation}
            disabled={!explanation || loading}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Listen to explanation"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          
          <button
            onClick={saveExplanation}
            disabled={!explanation || loading}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Save explanation"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Topic */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Explaining: {topic}
        </h3>
        {userInterests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userInterests.map((interest, index) => (
              <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-3 text-indigo-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Generating personalized explanation...</span>
            </div>
          </div>
        ) : explanation ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {explanation}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ask me to explain any topic and I'll adapt it to your learning style!</p>
          </div>
        )}
      </div>

      {/* Learning Style Indicator */}
      <div className="mt-4 p-3 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getStyleColor(learningStyle.dominant)}`}></div>
          <span className="text-gray-700">
            This explanation is optimized for <strong>{learningStyle.dominant}</strong> learners
          </span>
        </div>
      </div>

      {/* Saved Explanations Preview */}
      {savedExplanations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Recent Saved Explanations ({savedExplanations.length})
          </h4>
          <div className="space-y-2">
            {savedExplanations.slice(0, 3).map((saved) => (
              <div key={saved.id} className="text-xs bg-gray-50 rounded p-2">
                <div className="flex items-center gap-2">
                  {getStyleIcon(saved.learningStyle)}
                  <span className="font-medium">{saved.topic}</span>
                  <span className="text-gray-500">
                    {new Date(saved.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveExplanationEngine;
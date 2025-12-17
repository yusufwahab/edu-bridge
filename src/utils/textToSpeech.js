let currentAudio = null;
let isPlaying = false;

export const textToSpeech = async (text, voice = 'Idera') => {
  // If already playing, stop it
  if (isPlaying) {
    stopSpeech();
    return null;
  }

  try {
    const apiKey = import.meta.env.VITE_YARNGPT_API_KEY;
    
    if (!apiKey) {
      console.warn('YarnGPT API key not found, using browser TTS');
      return useBrowserTTS(text);
    }

    const optimizedText = text.substring(0, 500);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('https://yarngpt.ai/api/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: optimizedText,
        voice: voice,
        response_format: 'mp3',
        speed: 1.2
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`YarnGPT TTS failed: ${response.status}, using browser TTS`);
      return useBrowserTTS(text);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    currentAudio = new Audio(audioUrl);
    isPlaying = true;
    
    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      isPlaying = false;
      currentAudio = null;
    };
    
    await currentAudio.play();
    
    return audioUrl;
  } catch (error) {
    console.warn('YarnGPT TTS error, using browser TTS:', error.message);
    return useBrowserTTS(text);
  }
};

const useBrowserTTS = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isPlaying = true;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onend = () => {
      isPlaying = false;
    };
    
    window.speechSynthesis.speak(utterance);
    return 'browser-tts';
  }
  console.error('Text-to-speech not supported');
  return null;
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isPlaying = false;
};

export const isSpeechPlaying = () => isPlaying;

// Stop speech when page becomes hidden
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSpeech();
    }
  });
}
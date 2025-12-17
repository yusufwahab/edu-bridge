export const textToSpeech = async (text, voice = 'Idera') => {
  try {
    const optimizedText = text.substring(0, 500);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch('https://yarngpt.ai/api/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_YARNGPT_API_KEY}`,
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
      throw new Error(`TTS failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    audio.onended = () => URL.revokeObjectURL(audioUrl);
    await audio.play();
    
    return audioUrl;
  } catch (error) {
    console.error('TTS error:', error);
    return null;
  }
};
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function VoiceInput({ onResult, className, label }) {
  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupportsSpeech(false);
    }
  }, []);

  const toggleListening = () => {
    if (!browserSupportsSpeech) {
      toast.error('🎙️ Voice AI requires Chrome or Edge browser. Please switch browsers to use this feature.', {
        duration: 5000,
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English for better accuracy with Indian names/units

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('🎙️ AI Listening... Speak now!', { duration: 3000 });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = Math.round(event.results[0][0].confidence * 100);
      onResult(transcript);
      setIsListening(false);
      toast.success(`🤖 AI Captured: "${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}" (${confidence}% confidence)`);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error('🎙️ Microphone access denied. Please allow microphone permissions in your browser settings.');
      } else if (event.error === 'no-speech') {
        toast.warning('🎙️ No speech detected. Please try again and speak clearly.');
      } else {
        toast.error('🤖 AI could not process the voice command. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? 'destructive' : 'outline'}
      size={label ? 'default' : 'icon'}
      onClick={toggleListening}
      className={`${className} transition-all gap-2 ${isListening ? 'animate-pulse ring-2 ring-red-400 ring-offset-2' : ''}`}
      title={browserSupportsSpeech ? 'Click to start AI Voice Input' : 'Voice AI requires Chrome/Edge'}
    >
      {isListening ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> {label ? 'Listening...' : ''}</>
      ) : (
        <><Mic className={`h-4 w-4 ${!browserSupportsSpeech ? 'opacity-40' : ''}`} /> {label || ''}</>
      )}
    </Button>
  );
}

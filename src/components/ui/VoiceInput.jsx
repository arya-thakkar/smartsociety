import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function VoiceInput({ onResult, className }) {
  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupportsSpeech(false);
    }
  }, []);

  const toggleListening = () => {
    if (!browserSupportsSpeech) {
      toast.error("Your browser doesn't support AI voice input. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("AI Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
      toast.success("Voice captured!");
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      toast.error("AI could not understand the voice command.");
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
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={`${className} transition-all ${isListening ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : ''}`}
      title="AI Voice Input (No typing needed)"
    >
      {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}

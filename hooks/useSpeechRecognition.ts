import { useState, useEffect, useRef, useCallback } from 'react';

// TypeScript definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const hasRecognitionSupport = !!SpeechRecognition;

    useEffect(() => {
        if (!hasRecognitionSupport) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after user finishes speaking
        recognition.interimResults = false; // Only care about the final result
        recognition.lang = 'bn-BD'; // Primarily for Bengali, but often handles English too

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setFinalTranscript(transcript);
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error, event.message);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        // Cleanup: ensure recognition is stopped when the component unmounts.
        return () => {
             if (recognitionRef.current) {
                recognitionRef.current.stop();
             }
        };
    }, [hasRecognitionSupport]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setFinalTranscript(''); // Clear previous transcript
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error("Error starting speech recognition:", error);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    // This is the value the component will consume.
    const transcriptToReturn = finalTranscript;
    
    // Function for component to call after consuming transcript
    const clearTranscript = useCallback(() => {
        setFinalTranscript('');
    }, []);

    return {
        isListening,
        transcript: transcriptToReturn,
        startListening,
        stopListening,
        hasRecognitionSupport,
        clearTranscript,
    };
};

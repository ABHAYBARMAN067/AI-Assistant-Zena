import React, { useState } from 'react';
import './App.css';
import { FaMicrophone } from "react-icons/fa";
import va from './assets/ai.png';
import speakGIF from './assets/speak.gif';
import { askGemini } from './google';

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const name = "User"; 

  let recognition;

  if ('webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
  } else {
    alert("Speech Recognition not supported in your browser.");
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (text) => {
    const lowerText = text.toLowerCase();
    return false; 
  };

  const handleListen = () => {
    if (!recognition || isProcessing) return;

    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      recognition.stop();

      console.log("User said:", transcript); 
      const handled = handleCommand(transcript);
      if (!handled) {
        setIsProcessing(true);

        const reply = await askGemini(transcript);
        setAiResponse(reply);
        console.log(" Zeno replied:", reply); 
        speak(reply);

        setTimeout(() => setIsProcessing(false), 4000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="main">
      <img src={speaking ? speakGIF : va} alt="AI Assistant" id="zena" />
      <span>I'm Zena, Your Advanced Virtual Assistant</span>
      <span>Hello, {name}!</span>

      <button onClick={handleListen} disabled={isListening || speaking || isProcessing}>
        {isListening ? 'Listening...' : 'Tap to Speak'} <FaMicrophone />
      </button>

      <div className="response-box">
        <p className="req"><strong>You said:</strong> {userText}</p>
       <p className="res"><strong>Zena says:</strong> {aiResponse}</p>

      </div>
    </div>
  );
};

export default App;



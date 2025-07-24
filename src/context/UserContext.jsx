import React, { createContext, useState } from 'react';

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);

  function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);

    const voices = synth.getVoices();
    const femaleVoice = voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.includes("Google UK English Female")
    );

    if (femaleVoice) {
      utter.voice = femaleVoice;
    }

    utter.volume = 1;
    utter.rate = 1;
    utter.pitch = 1.2;
    utter.lang = "en-US";

    synth.cancel();
    setSpeaking(true);

    utter.onend = () => setSpeaking(false);
    synth.speak(utter);
  }

  const value = {
    speak,
    speaking
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;

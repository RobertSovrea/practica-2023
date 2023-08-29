import React, { useState, useRef } from 'react';
import './styles.css';
import ScenarioForm from './components/ScenarioForm';
import GeneratedText from './components/GeneratedText';
import Select from 'react-select';
import History from './components/History';

function App() {
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [history, setHistory] = useState([]);
  const utteranceRef = useRef(null);

  const texts = [
    "Text despre Axios...",
    "Text despre Blockchain...",
    "Text despre Metaverse..."
  ];

  const handleScenarioGenerated = (text) => {
    setGeneratedText(text);
    setHistory(prevHistory => [...prevHistory, text]);
  };

  const handleReadText = () => {
    if ('speechSynthesis' in window && generatedText) {
      const newUtterance = new SpeechSynthesisUtterance(generatedText);
      if (selectedVoice) newUtterance.voice = selectedVoice.value;
      if (selectedRate) newUtterance.rate = selectedRate.value;
      utteranceRef.current = newUtterance;
      window.speechSynthesis.speak(newUtterance);

      // Nu trebuie să mai creezi un obiect Audio pentru citirea textului
    }
  };

  const handleDownload = async (blobType, filename) => {
    if (generatedText) {
      setLoading(true);

      try {
        const blob = new Blob([generatedText], { type: blobType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      } catch (error) {
        console.error('Eroare la descărcarea fișierului:', error);
      }

      setLoading(false);
    }
  };

  const handleGenerateScenario = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedScenario = texts[currentTextIndex];
      setGeneratedText(generatedScenario);
      setHistory(prevHistory => [...prevHistory, generatedScenario]);

      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    } catch (error) {
      console.error('Eroare la generarea scenariului:', error);
    }

    setLoading(false);
  };

  const voiceOptions = window.speechSynthesis.getVoices().map(voice => ({
    value: voice,
    label: voice.name
  }));

  const rateOptions = [
    { value: 0.5, label: 'Viteză redusă' },
    { value: 1, label: 'Viteză normală' },
    { value: 1.5, label: 'Viteză crescută' }
  ];

  return (
    <div className="container">
      <div className="app-card">
        <div className="app-header">
          <img src={process.env.PUBLIC_URL + '/ccreator.png'} alt="Content Creator Logo" className="app-logo" />
          <h1 className="app-title">Content Creator</h1>
        </div>
        <ScenarioForm onScenarioGenerated={handleScenarioGenerated} />
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        <GeneratedText generatedText={generatedText} />
        <div className="button-group">
          <button onClick={handleReadText} className="color-button read-button">Citește Textul</button>
          <button onClick={() => handleDownload('text/plain', 'generated_text.txt')} className="color-button download-button">Descarcă Textul</button>
          <button onClick={() => handleDownload('audio/mpeg', 'generated_speech.mp3')} className="color-button download-button">Descarcă Discursul (MP3)</button>
          <button onClick={handleGenerateScenario} className="color-button secret-button">Simulare</button>
        </div>
        <div className="settings-container">
          <div className="setting">
            <label>Voce:</label>
            <Select
              options={voiceOptions}
              value={selectedVoice}
              onChange={(selectedOption) => setSelectedVoice(selectedOption)}
            />
          </div>
          <div className="setting">
            <label>Viteză de Citire:</label>
            <Select
              options={rateOptions}
              value={selectedRate}
              onChange={(selectedOption) => setSelectedRate(selectedOption)}
            />
          </div>
        </div>
        <History history={history} />
      </div>
    </div>
  );
}

export default App;

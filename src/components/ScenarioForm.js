import React, { useState } from 'react';
import axios from 'axios';

const ScenarioForm = ({ onScenarioGenerated }) => {
  const [scenarioDetails, setScenarioDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateScenario = async () => {
    setLoading(true); // Activează starea de încărcare

    try {
      const response = await axios.get(
        'https://baconipsum.com/api/?type=all-meat&paras=1'
      );

      onScenarioGenerated(response.data.join(' '));
    } catch (error) {
      console.error('Error generating scenario:', error);
    }

    setLoading(false); // Dezactivează starea de încărcare
  };

  return (
    <div className="scenario-form">
      <textarea
        placeholder="Introduceți detalii despre scenariu..."
        value={scenarioDetails}
        onChange={(e) => setScenarioDetails(e.target.value)}
      />
      <button onClick={handleGenerateScenario} className="generate-button">
        {loading ? 'Se generează...' : 'Generează Scenariu'}
      </button>
    </div>
  );
};

export default ScenarioForm;

import React from 'react';

const History = ({ history }) => {
  return (
    <div className="history">
      <h2>Istoricul Scenariilor Generate:</h2>
      <ul>
        {history.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default History;

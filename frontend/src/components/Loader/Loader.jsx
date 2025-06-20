import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="code-loader-wrapper">
      <span className="bracket left-bracket">{'{'}</span>
      <span className="bracket right-bracket">{'}'}</span>
    </div>
  );
};

export default Loader;

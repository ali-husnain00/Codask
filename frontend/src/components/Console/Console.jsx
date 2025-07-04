import React from 'react';
import './Console.css';

const Console = ({ logs }) => {
  return (
    <div className="console-container">
      <div className="console-header">Console Output</div>
      <div className="console-logs">
        {logs.length === 0 ? (
          <div className="console-empty">▶ Output will appear here</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`console-log ${log.type}`}>
              <pre>{log.message}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Console;

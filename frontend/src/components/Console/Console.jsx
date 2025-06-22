import React, { useState, useEffect } from 'react';
import './Console.css';

const Console = ({
  logs,
  requiresInput,
  inputPrompts = [],
  currentPromptIndex = 0,
  onSubmitInput,
  isMultiLineInput = false,
}) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput('');
  }, [currentPromptIndex, requiresInput]);

  const handleSubmit = () => {
    if (input.trim() === '') return;
    onSubmitInput(input);
    setInput('');
  };

  return (
    <div className="console-container">
      <div className="console-header">Console Output</div>
      <pre className="console-body">
        {logs.map((log, index) => (
          <div key={index} className={`log ${log.type}`}>
            {log.message}
          </div>
        ))}
      </pre>

      {requiresInput && (
        <div className="console-input">
          {!isMultiLineInput && inputPrompts.length > 0 && (
            <>
              <label className="console-prompt-label">{inputPrompts[currentPromptIndex]}</label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                autoFocus
              />
            </>
          )}

          {isMultiLineInput && (
            <>
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                autoFocus
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Console;

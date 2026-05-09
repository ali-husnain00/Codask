import React from 'react';

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="animate-pulse font-mono text-5xl font-bold text-[var(--primary)]">{`{ }`}</div>
    </div>
  );
};

export default Loader;

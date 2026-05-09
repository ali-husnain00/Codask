import React from 'react';

const Console = ({ logs, stdin, setStdin }) => {
  return (
    <div className="flex h-full min-h-0 flex-col space-y-4 p-4">
      {/* Stdin Panel */}
      <div className="flex flex-col h-[140px] flex-shrink-0 rounded-[10px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Standard Input (stdin)</div>
        <textarea 
          className="flex-1 resize-none bg-transparent p-3 text-sm text-[var(--text)] outline-none focus:ring-0 placeholder:text-[var(--text-muted)] font-mono"
          placeholder="Enter input here for your program (e.g. 5 10 20)..."
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
        />
      </div>

      {/* Console Output */}
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Console Output</div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {logs.length === 0 ? (
            <div className="text-sm text-[var(--text-muted)] italic">▶ Output will appear here...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={`mb-2 rounded-md px-3 py-2 text-sm border ${log.type === "error" ? "border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.05)] text-[var(--danger)]" : "border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)] text-[var(--success)]"}`}>
                <pre className="whitespace-pre-wrap font-mono">{log.message}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Console;

import React, { useState, useEffect, useRef } from 'react';

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to WebOS Terminal', 'Type "help" for available commands.']);
  const [currentLine, setCurrentLine] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    let output = '';

    switch (command) {
      case 'help':
        output = 'Available commands: help, clear, echo, date, whoami, uname';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        output = args.slice(1).join(' ');
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'guest_user';
        break;
      case 'uname':
        output = 'WebOS Darwin Kernel Version 1.0.0';
        break;
      case '':
        break;
      default:
        output = `command not found: ${command}`;
    }

    setHistory(prev => [...prev, `$ ${cmd}`, output].filter(Boolean));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentLine);
      setCurrentLine('');
    }
  };

  return (
    <div 
      className="h-full bg-[#1e1e1e] text-[#fafafa] font-mono p-4 text-sm overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-auto scrollbar-hide" ref={containerRef}>
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-1 leading-relaxed opacity-90">{line}</div>
        ))}
        <div className="flex items-center">
          <span className="mr-2 text-green-400">➜</span>
          <span className="mr-2 text-blue-400">~</span>
          <input
            ref={inputRef}
            type="text"
            value={currentLine}
            onChange={(e) => setCurrentLine(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none flex-1 text-white caret-gray-400"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
import { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Terminal as TerminalIcon, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalProps {
  onClose: () => void;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const mockHistory: TerminalLine[] = [
  {
    id: '1',
    type: 'command',
    content: 'npm run dev',
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '2',
    type: 'output',
    content: '> vite',
    timestamp: new Date(Date.now() - 119000)
  },
  {
    id: '3',
    type: 'output',
    content: 'Local:   http://localhost:5173/',
    timestamp: new Date(Date.now() - 118000)
  },
  {
    id: '4',
    type: 'output',
    content: 'Network: use --host to expose',
    timestamp: new Date(Date.now() - 117000)
  },
  {
    id: '5',
    type: 'command',
    content: 'npm run build',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '6',
    type: 'output',
    content: 'vite build',
    timestamp: new Date(Date.now() - 59000)
  },
  {
    id: '7',
    type: 'output',
    content: '✓ built in 2.34s',
    timestamp: new Date(Date.now() - 57000)
  }
];

export const Terminal = ({ onClose }: TerminalProps) => {
  const [history, setHistory] = useState(mockHistory);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = () => {
    if (!currentInput.trim() || isRunning) return;

    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: currentInput,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, commandLine]);
    setIsRunning(true);

    // Simulate command execution
    setTimeout(() => {
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: currentInput.includes('error') ? 'error' : 'output',
        content: getCommandOutput(currentInput),
        timestamp: new Date()
      };
      
      setHistory(prev => [...prev, outputLine]);
      setIsRunning(false);
    }, 1000);

    setCurrentInput('');
  };

  const getCommandOutput = (command: string): string => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'ls' || cmd === 'dir') {
      return 'src/  public/  node_modules/  package.json  tsconfig.json  README.md';
    } else if (cmd.startsWith('cd ')) {
      return '';
    } else if (cmd === 'pwd') {
      return '/workspace/cursor-ai-editor';
    } else if (cmd.startsWith('npm ')) {
      return 'Command executed successfully';
    } else if (cmd === 'clear') {
      setTimeout(() => setHistory([]), 100);
      return '';
    } else if (cmd.includes('error')) {
      return 'Error: Command failed with exit code 1';
    } else {
      return `Command '${command}' executed`;
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-terminal-bg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-border-subtle bg-panel-bg">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-4 w-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Terminal</span>
          <span className="text-xs text-text-muted">bash</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-hover-bg"
            onClick={clearTerminal}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-hover-bg"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-hover-bg"
          >
            <Square className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-hover-bg"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
      >
        <div className="space-y-1">
          {history.map(line => (
            <div key={line.id} className="flex">
              <span className="text-text-muted text-xs mr-2 min-w-[60px]">
                {formatTime(line.timestamp)}
              </span>
              <div className="flex-1">
                {line.type === 'command' ? (
                  <div className="flex items-center">
                    <span className="text-ai-accent mr-2">$</span>
                    <span className="text-text-primary">{line.content}</span>
                  </div>
                ) : (
                  <span className={
                    line.type === 'error' 
                      ? 'text-error' 
                      : 'text-text-secondary'
                  }>
                    {line.content}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {/* Current Input Line */}
          <div className="flex items-center">
            <span className="text-text-muted text-xs mr-2 min-w-[60px]">
              {formatTime(new Date())}
            </span>
            <span className="text-ai-accent mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeCommand();
                } else if (e.key === 'ArrowUp' && history.length > 0) {
                  e.preventDefault();
                  const lastCommand = [...history].reverse().find(line => line.type === 'command');
                  if (lastCommand) {
                    setCurrentInput(lastCommand.content);
                  }
                }
              }}
              className="flex-1 bg-transparent outline-none text-text-primary placeholder-text-muted"
              placeholder={isRunning ? "Running..." : "Type a command..."}
              disabled={isRunning}
              autoFocus
            />
            {isRunning && (
              <div className="ml-2">
                <div className="w-2 h-2 bg-ai-accent rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="p-2 border-t border-border-subtle bg-panel-bg">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-hover-bg"
            onClick={() => setCurrentInput('npm run dev')}
          >
            <Play className="h-3 w-3 mr-1" />
            Run Dev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-hover-bg"
            onClick={() => setCurrentInput('npm run build')}
          >
            Build
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-hover-bg"
            onClick={() => setCurrentInput('npm test')}
          >
            Test
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs hover:bg-hover-bg"
            onClick={() => setCurrentInput('clear')}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
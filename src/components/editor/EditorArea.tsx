import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

const mockTabs: Tab[] = [
  {
    id: '1',
    name: 'DynamicHomepage.tsx',
    language: 'typescript',
    isDirty: true,
    content: `import React from 'react';
import { useState, useEffect } from 'react';

interface Props {
  title: string;
  content: string;
}

const DynamicHomepage: React.FC<Props> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulating async data fetch
    const fetchData = async () => {
      try {
        const response = await fetch('/api/content');
        const result = await response.json();
        setData(result);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="homepage">
      <h1 className="title">{title}</h1>
      <div className="content">
        {content && <p>{content}</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default DynamicHomepage;`
  },
  {
    id: '2',
    name: 'App.tsx',
    language: 'typescript',
    isDirty: false,
    content: `import React from 'react';
import DynamicHomepage from './components/DynamicHomepage';

function App() {
  return (
    <div className="App">
      <DynamicHomepage 
        title="Welcome to Cursor AI" 
        content="A powerful AI-powered code editor"
      />
    </div>
  );
}

export default App;`
  }
];

export const EditorArea = () => {
  const [tabs, setTabs] = useState(mockTabs);
  const [activeTab, setActiveTab] = useState('1');
  const [cursorPositions, setCursorPositions] = useState<Record<string, number>>({});

  const closeTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const updateTabContent = (id: string, content: string) => {
    setTabs(tabs.map(tab => 
      tab.id === id 
        ? { ...tab, content, isDirty: true }
        : tab
    ));
  };

  const handleCursorPosition = (id: string, position: number) => {
    setCursorPositions(prev => ({ ...prev, [id]: position }));
  };

  const addNewTab = () => {
    const newId = (tabs.length + 1).toString();
    const newTab: Tab = {
      id: newId,
      name: `untitled-${newId}.tsx`,
      content: '// New file\n',
      language: 'typescript',
      isDirty: true
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newId);
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const renderCode = (content: string, language: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className="flex">
        <span className="w-12 text-right pr-4 text-text-muted select-none text-xs leading-6">
          {index + 1}
        </span>
        <span className="flex-1 text-sm leading-6">
          <SyntaxHighlighter line={line} language={language} />
        </span>
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex bg-panel-bg border-b border-border-subtle">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center px-4 py-2 border-r border-border-subtle cursor-pointer group transition-colors ${
              activeTab === tab.id 
                ? 'bg-editor-bg text-text-primary' 
                : 'bg-panel-bg text-text-secondary hover:bg-hover-bg'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-sm mr-2">
              {tab.name}
              {tab.isDirty && <span className="text-warning ml-1">●</span>}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-hover-bg"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 m-1 hover:bg-hover-bg"
          onClick={addNewTab}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden bg-editor-bg">
        {currentTab ? (
          <div className="h-full flex">
            {/* Line Numbers */}
            <div className="flex flex-col bg-editor-bg border-r border-border-subtle py-4 px-2">
              {currentTab.content.split('\n').map((_, index) => (
                <div key={index} className="text-right text-xs leading-6 text-text-muted select-none w-10">
                  {index + 1}
                </div>
              ))}
            </div>
            
            {/* Editable Text Area */}
            <div className="flex-1 relative overflow-hidden">
              <textarea
                value={currentTab.content}
                onChange={(e) => updateTabContent(currentTab.id, e.target.value)}
                onScroll={(e) => {
                  const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                  if (overlay) {
                    overlay.scrollTop = e.currentTarget.scrollTop;
                    overlay.scrollLeft = e.currentTarget.scrollLeft;
                  }
                }}
                className="w-full h-full p-4 bg-transparent text-transparent font-mono text-sm leading-6 resize-none outline-none border-none caret-text-accent relative z-10 overflow-auto"
                spellCheck={false}
                style={{
                  background: 'transparent',
                  caretColor: 'hsl(var(--text-accent))'
                }}
              />
              
              {/* Syntax Highlighting Overlay */}
              <div 
                className="absolute top-0 left-0 w-full h-full p-4 font-mono text-sm leading-6 pointer-events-none overflow-hidden"
                style={{ 
                  color: 'hsl(var(--text-primary))'
                }}
              >
                <div className="whitespace-pre-wrap">
                  {currentTab.content.split('\n').map((line, index) => (
                    <div key={index} className="leading-6">
                      <SyntaxHighlighter line={line} language={currentTab.language} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted">
            <div className="text-center">
              <p className="text-lg mb-2">No files open</p>
              <p className="text-sm">Open a file from the explorer to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SyntaxHighlighter = ({ line, language }: { line: string; language: string }) => {
  const highlightSyntax = (text: string) => {
    // Enhanced syntax highlighting patterns
    const keywords = ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'implements', 'public', 'private', 'protected', 'static', 'readonly', 'abstract'];
    const types = ['React', 'string', 'number', 'boolean', 'object', 'Props', 'FC', 'Component', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'HTMLElement', 'Promise', 'Array', 'Map', 'Set'];
    const operators = ['=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '&&', '||', '!', '?', ':', '=>', '...', '??'];
    
    let highlighted = text;
    
    // Highlight strings (including template literals)
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
      '<span style="color: hsl(var(--syntax-string))">$1$2$1</span>');
    
    // Highlight template literal expressions
    highlighted = highlighted.replace(/(\$\{[^}]*\})/g,
      '<span style="color: hsl(var(--syntax-variable))">$1</span>');
    
    // Highlight single line comments
    highlighted = highlighted.replace(/(\/\/.*$)/gm,
      '<span style="color: hsl(var(--syntax-comment))">$1</span>');
    
    // Highlight multi-line comments
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/gm,
      '<span style="color: hsl(var(--syntax-comment))">$1</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g,
      '<span style="color: hsl(var(--syntax-number))">$1</span>');
    
    // Highlight JSX/TSX tags
    highlighted = highlighted.replace(/(<\/?[a-zA-Z][a-zA-Z0-9]*)/g,
      '<span style="color: hsl(var(--syntax-tag))">$1</span>');
    
    // Highlight JSX/TSX attributes
    highlighted = highlighted.replace(/(\w+)=/g,
      '<span style="color: hsl(var(--syntax-attribute))">$1</span>=');
    
    // Highlight object properties
    highlighted = highlighted.replace(/(\w+):/g,
      '<span style="color: hsl(var(--syntax-property))">$1</span>:');
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, 
        `<span style="color: hsl(var(--syntax-keyword))">${keyword}</span>`);
    });
    
    // Highlight types and React hooks
    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      highlighted = highlighted.replace(regex, 
        `<span style="color: hsl(var(--syntax-function))">${type}</span>`);
    });
    
    // Highlight operators
    operators.forEach(op => {
      const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\${escapedOp}`, 'g');
      highlighted = highlighted.replace(regex, 
        `<span style="color: hsl(var(--syntax-operator))">${op}</span>`);
    });
    
    return highlighted;
  };

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: highlightSyntax(line)
      }}
    />
  );
};
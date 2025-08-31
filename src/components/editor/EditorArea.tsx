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

  const closeTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
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
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto bg-editor-bg">
        {currentTab ? (
          <div className="h-full p-4">
            <div className="font-mono text-sm">
              {renderCode(currentTab.content, currentTab.language)}
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
    // Simple syntax highlighting
    const keywords = ['import', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'async', 'await', 'try', 'catch'];
    const types = ['React', 'string', 'number', 'boolean', 'object', 'Props', 'FC'];
    
    let highlighted = text;
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, 
      '<span class="text-syntax-string">$1$2$1</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
      '<span class="text-syntax-comment">$1</span>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, 
        `<span class="text-syntax-keyword">${keyword}</span>`);
    });
    
    // Highlight types
    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      highlighted = highlighted.replace(regex, 
        `<span class="text-syntax-function">${type}</span>`);
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
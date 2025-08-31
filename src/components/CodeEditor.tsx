import { useState } from 'react';
import { Sidebar } from './editor/Sidebar';
import { EditorArea } from './editor/EditorArea';
import { AIAssistant } from './editor/AIAssistant';
import { Terminal } from './editor/Terminal';
import { Toolbar } from './editor/Toolbar';
import { ResizablePanel } from './ui/ResizablePanel';
import { Button } from '@/components/ui/button';
import { PanelLeft, MessageSquare, Terminal as TerminalIcon, X } from 'lucide-react';

export const CodeEditor = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);

  return (
    <div className="h-screen w-full bg-editor-bg text-text-primary flex flex-col overflow-hidden">
      <Toolbar />
      
      {/* Panel Toggle Controls */}
      <div className="flex items-center gap-2 p-2 border-b border-border-subtle bg-editor-surface">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSidebar(!showSidebar)}
          className={`h-8 px-2 ${showSidebar ? 'bg-active-bg text-text-accent' : 'text-text-muted'}`}
        >
          <PanelLeft className="h-4 w-4 mr-1" />
          Explorer
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAI(!showAI)}
          className={`h-8 px-2 ${showAI ? 'bg-active-bg text-text-accent' : 'text-text-muted'}`}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          AI Assistant
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTerminal(!showTerminal)}
          className={`h-8 px-2 ${showTerminal ? 'bg-active-bg text-text-accent' : 'text-text-muted'}`}
        >
          <TerminalIcon className="h-4 w-4 mr-1" />
          Terminal
        </Button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        {showSidebar && (
          <ResizablePanel
            width={sidebarWidth}
            onResize={setSidebarWidth}
            minWidth={200}
            maxWidth={500}
            className="bg-sidebar-bg border-r border-border-subtle"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-2 border-b border-border-subtle">
                <span className="text-sm font-medium text-text-primary">EXPLORER</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                  className="h-6 w-6 p-0 hover:bg-hover-bg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <Sidebar />
              </div>
            </div>
          </ResizablePanel>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 bg-editor-bg">
              <EditorArea />
            </div>
            
            {/* AI Assistant Panel */}
            {showAI && (
              <ResizablePanel
                width={assistantWidth}
                onResize={setAssistantWidth}
                minWidth={300}
                maxWidth={600}
                className="bg-ai-bg border-l border-border-subtle"
                side="left"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-2 border-b border-border-subtle">
                    <span className="text-sm font-medium text-text-primary">AI ASSISTANT</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAI(false)}
                      className="h-6 w-6 p-0 hover:bg-hover-bg"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <AIAssistant />
                  </div>
                </div>
              </ResizablePanel>
            )}
          </div>
          
          {/* Terminal */}
          {showTerminal && (
            <ResizablePanel
              height={terminalHeight}
              onResize={setTerminalHeight}
              minHeight={100}
              maxHeight={400}
              className="bg-terminal-bg border-t border-border-subtle"
              direction="vertical"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-border-subtle">
                  <span className="text-sm font-medium text-text-primary">TERMINAL</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTerminal(false)}
                    className="h-6 w-6 p-0 hover:bg-hover-bg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Terminal onClose={() => setShowTerminal(false)} />
                </div>
              </div>
            </ResizablePanel>
          )}
        </div>
      </div>
    </div>
  );
};
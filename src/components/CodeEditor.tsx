import { useState } from 'react';
import { Sidebar } from './editor/Sidebar';
import { EditorArea } from './editor/EditorArea';
import { AIAssistant } from './editor/AIAssistant';
import { Terminal } from './editor/Terminal';
import { Toolbar } from './editor/Toolbar';
import { ResizablePanel } from './ui/ResizablePanel';

export const CodeEditor = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [assistantWidth, setAssistantWidth] = useState(400);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [showTerminal, setShowTerminal] = useState(true);

  return (
    <div className="h-screen w-full bg-editor-bg text-text-primary flex flex-col overflow-hidden">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <ResizablePanel
          width={sidebarWidth}
          onResize={setSidebarWidth}
          minWidth={200}
          maxWidth={500}
          className="bg-sidebar-bg border-r border-border-subtle"
        >
          <Sidebar />
        </ResizablePanel>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 bg-editor-bg">
              <EditorArea />
            </div>
            
            {/* AI Assistant Panel */}
            <ResizablePanel
              width={assistantWidth}
              onResize={setAssistantWidth}
              minWidth={300}
              maxWidth={600}
              className="bg-ai-bg border-l border-border-subtle"
              side="left"
            >
              <AIAssistant />
            </ResizablePanel>
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
              <Terminal onClose={() => setShowTerminal(false)} />
            </ResizablePanel>
          )}
        </div>
      </div>
    </div>
  );
};
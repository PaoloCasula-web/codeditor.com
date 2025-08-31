import { useState } from 'react';
import { Send, MoreVertical, Sparkles, Code, MessageSquare, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: "I'll locate and update any eager imports of the heavy GraphicDesign component to lazy dynamic imports, then rebuild and re-run the size enforcer.",
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '2',
    type: 'ai',
    content: "I'll update DynamicHomepage.tsx to stop importing product components and instead navigate to a random live product path, which will rely on route-based code splitting. Then I'll rebuild and run the size enforcer.",
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: '3',
    type: 'ai',
    content: "The model made no changes to the file.",
    timestamp: new Date(Date.now() - 10000)
  }
];

export const AIAssistant = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand your request. Let me analyze the code and provide suggestions...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-ai-bg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-ai-accent" />
          <span className="font-medium text-text-primary">AI Assistant</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border-subtle">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-left h-auto p-3 bg-hover-bg border-border-subtle hover:bg-active-bg"
          >
            <Code className="h-4 w-4 mr-2 text-ai-accent" />
            <div>
              <div className="text-xs font-medium">Code Review</div>
              <div className="text-xs text-text-muted">Analyze current file</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-left h-auto p-3 bg-hover-bg border-border-subtle hover:bg-active-bg"
          >
            <Lightbulb className="h-4 w-4 mr-2 text-warning" />
            <div>
              <div className="text-xs font-medium">Optimize</div>
              <div className="text-xs text-text-muted">Improve performance</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                {message.type === 'ai' ? (
                  <Sparkles className="h-3 w-3 text-ai-accent" />
                ) : (
                  <MessageSquare className="h-3 w-3" />
                )}
                <span>{message.type === 'ai' ? 'AI' : 'You'}</span>
                <span>{formatTime(message.timestamp)}</span>
              </div>
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'ai' 
                  ? 'bg-hover-bg text-text-primary' 
                  : 'bg-selection-bg text-white'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                <Sparkles className="h-3 w-3 text-ai-accent animate-pulse" />
                <span>AI</span>
                <span>thinking...</span>
              </div>
              <div className="p-3 rounded-lg text-sm bg-hover-bg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-ai-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-ai-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-ai-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask AI anything about your code..."
            className="flex-1 h-10 px-3 bg-hover-bg border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-ai-accent"
          />
          <Button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isThinking}
            className="h-10 w-10 p-0 bg-ai-accent hover:bg-ai-accent-light disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
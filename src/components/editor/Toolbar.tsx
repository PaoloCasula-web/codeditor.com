import { Menu, Search, Settings, GitBranch, PlayCircle, Bug, Terminal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Toolbar = () => {
  return (
    <div className="h-12 bg-panel-bg border-b border-border-subtle flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-text-primary">Cursor AI</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-text-secondary hover:bg-hover-bg hover:text-text-primary">
            <FileText className="h-4 w-4 mr-2" />
            File
          </Button>
          <Button variant="ghost" size="sm" className="text-text-secondary hover:bg-hover-bg hover:text-text-primary">
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-text-secondary hover:bg-hover-bg hover:text-text-primary">
            View
          </Button>
          <Button variant="ghost" size="sm" className="text-text-secondary hover:bg-hover-bg hover:text-text-primary">
            Go
          </Button>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full h-8 pl-10 pr-4 bg-hover-bg border border-border-subtle rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-selection-bg"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg text-text-secondary hover:text-text-primary">
          <GitBranch className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg text-text-secondary hover:text-text-primary">
          <PlayCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg text-text-secondary hover:text-text-primary">
          <Bug className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg text-text-secondary hover:text-text-primary">
          <Terminal className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-hover-bg text-text-secondary hover:text-text-primary">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
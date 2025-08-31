import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

// File type icons mapping
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'tsx':
    case 'ts':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-blue-600 text-white">
          TS
        </div>
      );
    case 'jsx':
    case 'js':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-yellow-500 text-black">
          JS
        </div>
      );
    case 'html':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-orange-600 text-white">
          H
        </div>
      );
    case 'css':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-blue-500 text-white">
          C
        </div>
      );
    case 'json':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-green-600 text-white">
          J
        </div>
      );
    case 'md':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-gray-600 text-white">
          M
        </div>
      );
    case 'ico':
      return (
        <div className="h-4 w-4 mr-2 ml-5 flex items-center justify-center rounded text-xs font-bold bg-purple-600 text-white">
          I
        </div>
      );
    default:
      return <File className="h-4 w-4 mr-2 ml-5 text-text-secondary" />;
  }
};

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          { name: 'CodeEditor.tsx', type: 'file' },
          { name: 'Sidebar.tsx', type: 'file' },
          { name: 'Terminal.tsx', type: 'file' }
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'Index.tsx', type: 'file' },
          { name: 'Settings.tsx', type: 'file' }
        ]
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'main.tsx', type: 'file' }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' }
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'README.md', type: 'file' }
];

export const Sidebar = () => {
  const [fileTree, setFileTree] = useState(mockFileTree);
  const [selectedFile, setSelectedFile] = useState<string | null>('CodeEditor.tsx');

  const toggleFolder = (path: string) => {
    const updateTree = (nodes: FileNode[], targetPath: string[]): FileNode[] => {
      return nodes.map(node => {
        if (node.name === targetPath[0]) {
          if (targetPath.length === 1) {
            return { ...node, isOpen: !node.isOpen };
          }
          return {
            ...node,
            children: node.children ? updateTree(node.children, targetPath.slice(1)) : undefined
          };
        }
        return node;
      });
    };
    
    setFileTree(updateTree(fileTree, path.split('/')));
  };

  const FileTreeNode = ({ node, depth = 0, path = '' }: { node: FileNode; depth?: number; path?: string }) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isSelected = selectedFile === node.name;
    
    return (
      <div key={currentPath}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer transition-colors hover:bg-hover-bg group ${
            isSelected ? 'bg-active-bg text-text-accent' : 'text-text-primary'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath);
            } else {
              setSelectedFile(node.name);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="h-4 w-4 mr-1 text-text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-text-muted" />
              )}
              {node.isOpen ? (
                <FolderOpen className="h-4 w-4 mr-2 text-syntax-function" />
              ) : (
                <Folder className="h-4 w-4 mr-2 text-syntax-function" />
              )}
            </>
          ) : (
            getFileIcon(node.name)
          )}
          <span className="text-sm flex-1">{node.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-hover-bg"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {node.children.map(child => (
              <FileTreeNode
                key={child.name}
                node={child}
                depth={depth + 1}
                path={currentPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border-subtle">
        <span className="text-sm font-medium text-text-primary">EXPLORER</span>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-hover-bg">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-hover-bg">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {fileTree.map(node => (
            <FileTreeNode key={node.name} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
};
'use client';

import { useState } from 'react';
import { useBoard } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export default function Sidebar() {
  const {
    boards,
    activeBoardId,
    createBoard,
    deleteBoard,
    setActiveBoard,
  } = useBoard();
  const [newBoardName, setNewBoardName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCreate = async () => {
    if (newBoardName.trim()) {
      await createBoard(newBoardName.trim());
      setNewBoardName('');
    }
  };

  return (
    <Card
      className={`h-screen border-r transition-all duration-300 flex flex-col rounded-l-none p-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && <h2 className="font-semibold">Boards</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Plus className="h-5 w-5" /> : '−'}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-auto p-2 space-y-2">
          <div className="space-y-1">
            {boards.map((board) => (
              <div
                key={board.id}
                className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-accent ${
                  board.id === activeBoardId ? 'bg-accent' : ''
                }`}
                onClick={() => setActiveBoard(board.id)}
              >
                <span className="truncate">{board.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-4 w-4"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await deleteBoard(board.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-2">
            <Input
              placeholder="New board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button className="w-full" onClick={handleCreate}>
              Create Board
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Board, Task } from '@/types';
import { useBoard } from '@/context/BoardContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColumnProps {
  id: 'today' | 'thisWeek' | 'future' | 'completed';
  title: string;
  tasks: Task[];
}

export default function Column({ id, title, tasks }: ColumnProps) {
  const { addTask, moveTask } = useBoard();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isCompletedColumn = id === 'completed';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    const [taskId, sourceColumn] = data.split(':');
    if (sourceColumn === id) return;
    moveTask(sourceColumn as keyof Board['columns'], id, taskId);
  };

  return (
    <Card
      className={cn(
        'flex flex-col min-w-60 max-w-75 pt-0 transition-all',
        isDragOver
          ? 'border-2 border-dashed border-primary bg-primary/10'
          : 'border shadow-sm',
        isCompletedColumn &&
          'bg-emerald-950/30 border-emerald-800/50',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader
        className={cn(
          'py-1.5 px-3 cursor-pointer flex items-center justify-between transition-colors rounded-t-lg',
          isCompletedColumn
            ? 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-100'
            : 'bg-muted/30 hover:bg-muted/50',
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold">
            {title}
          </CardTitle>
          {isCompletedColumn && (
            <span className="text-xs opacity-70">(archive)</span>
          )}
        </div>
        {isCollapsed ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="flex-1 p-3 pt-0 overflow-hidden">
          <ScrollArea className="h-full pr-3 -mr-3">
            <div className="space-y-2 pb-2">
              {tasks.map((task) => (
                <TaskCard key={task.id} columnId={id} task={task} />
              ))}
              <AddTaskForm
                columnId={id}
                onAdd={(title) => addTask(id, title)}
              />
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}

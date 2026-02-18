'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBoard } from '@/context/BoardContext';
import { Trash2, Edit, Check, X } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  columnId: 'today' | 'thisWeek' | 'future' | 'completed';
  task: Task;
}

export function TaskCard({ columnId, task }: TaskCardProps) {
  const { updateTask, deleteTask } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const isInCompleted = columnId === 'completed';

  const handleSave = async () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      await updateTask(columnId, task.id, { title: trimmed });
    }
    setIsEditing(false);
  };

  return (
    <Card
      className={cn(
        'py-1  group relative border border-border/50 bg-black/60 backdrop-blur-sm transition-all',
        'hover:border-primary/40 hover:shadow-md hover:shadow-primary/10',
        'active:scale-[0.98]',
        task.completed && 'opacity-60',
      )}
      draggable={!isEditing}
      onDragStart={(e) => {
        e.dataTransfer.setData(
          'text/plain',
          `${task.id}:${columnId}`,
        );
      }}
    >
      <CardContent className="p-1.5 flex items-center gap-2">
        {isEditing ? (
          <div className="flex-1 flex flex-col gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="h-8 text-sm bg-background/80 border-border/60 focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') setIsEditing(false);
              }}
            />
            <div className="flex gap-1.5 justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={handleSave}
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Checkbox
              checked={task.completed}
              onCheckedChange={
                isInCompleted
                  ? undefined
                  : async (checked) => {
                      await updateTask(columnId, task.id, {
                        completed: !!checked,
                      });
                    }
              }
              disabled={isInCompleted}
              className={cn(
                'mt-0.5 h-4 w-4',
                isInCompleted && 'opacity-40 cursor-not-allowed',
              )}
            />
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'text-sm font-medium leading-tight wrap-break-word',
                  task.completed &&
                    'line-through text-muted-foreground',
                  isInCompleted && 'text-muted-foreground/80',
                )}
              >
                {task.title}
              </h3>
            </div>

            {/* Actions appear on hover */}
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent/60"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                onClick={async () =>
                  await deleteTask(columnId, task.id)
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

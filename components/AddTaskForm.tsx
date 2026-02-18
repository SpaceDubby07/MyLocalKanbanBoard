'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  columnId: 'today' | 'thisWeek' | 'future' | 'completed';
  onAdd: (title: string) => Promise<void>;
}

export function AddTaskForm({ columnId, onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    if (title.trim()) {
      await onAdd(title.trim());
      setTitle('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start mt-3"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Add a task
      </Button>
    );
  }

  return (
    <div className="space-y-3 border rounded-md p-3 bg-background mt-3">
      <Input
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubmit}>
          Add task
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

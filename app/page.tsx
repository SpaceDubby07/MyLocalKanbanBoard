'use client';

import { useBoard } from '@/context/BoardContext';
import Sidebar from '@/components/Sidebar';
import Column from '@/components/Column';

export default function Home() {
  const { activeBoard } = useBoard();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">
        {' '}
        {/* Reduced p-6 to p-4 */}
        {!activeBoard ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Create or select a board from the sidebar
          </div>
        ) : (
          <div className="flex gap-4 h-full overflow-x-auto">
            {' '}
            <Column
              id="today"
              title="Today"
              tasks={activeBoard.columns.today}
            />
            <Column
              id="thisWeek"
              title="This Week"
              tasks={activeBoard.columns.thisWeek}
            />
            <Column
              id="future"
              title="Future"
              tasks={activeBoard.columns.future}
            />
            <Column
              id="completed"
              title="Completed"
              tasks={activeBoard.columns.completed}
            />
          </div>
        )}
      </main>
    </div>
  );
}

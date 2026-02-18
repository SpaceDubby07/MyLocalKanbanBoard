'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Board, Task } from '@/types';
import {
  getBoards,
  createBoard,
  deleteBoard,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
} from '@/actions/boardActions';

interface BoardContextType {
  boards: Board[];
  activeBoardId: string | null;
  activeBoard: Board | undefined;
  refreshBoards: () => Promise<void>;
  createBoard: (name: string) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  setActiveBoard: (id: string) => void;
  addTask: (
    columnId: keyof Board['columns'],
    title: string,
  ) => Promise<void>;
  updateTask: (
    columnId: keyof Board['columns'],
    taskId: string,
    updates: Partial<Task>,
  ) => Promise<void>;
  deleteTask: (
    columnId: keyof Board['columns'],
    taskId: string,
  ) => Promise<void>;
  moveTask: (
    sourceColumn: keyof Board['columns'],
    destColumn: keyof Board['columns'],
    taskId: string,
  ) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(
  undefined,
);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(
    null,
  );

  const setActiveBoard = (id: string) => {
    if (boards.some((b) => b.id === id)) {
      setActiveBoardId(id);
    } else {
      console.warn(`Board with id ${id} not found`);
    }
  };

  const refreshBoards = async () => {
    try {
      const data = await getBoards();
      setBoards(data);
      // Auto-select first board if none active and we have boards
      if (data.length > 0 && !activeBoardId) {
        setActiveBoardId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load boards:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshBoards();
  }, []);

  const handleCreateBoard = async (name: string) => {
    try {
      await createBoard(name);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    try {
      await deleteBoard(id);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const handleAddTask = async (
    columnId: keyof Board['columns'],
    title: string,
  ) => {
    if (!activeBoardId) return;
    try {
      await addTask(activeBoardId, columnId, title);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleUpdateTask = async (
    columnId: keyof Board['columns'],
    taskId: string,
    updates: Partial<Task>,
  ) => {
    if (!activeBoardId) return;
    try {
      await updateTask(activeBoardId, columnId, taskId, updates);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (
    columnId: keyof Board['columns'],
    taskId: string,
  ) => {
    if (!activeBoardId) return;
    try {
      await deleteTask(activeBoardId, columnId, taskId);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleMoveTask = async (
    sourceColumn: keyof Board['columns'],
    destColumn: keyof Board['columns'],
    taskId: string,
  ) => {
    if (!activeBoardId) return;
    try {
      await moveTask(activeBoardId, sourceColumn, destColumn, taskId);
      await refreshBoards();
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  return (
    <BoardContext.Provider
      value={{
        boards,
        activeBoardId,
        activeBoard,
        refreshBoards,
        createBoard: handleCreateBoard,
        deleteBoard: handleDeleteBoard,
        setActiveBoard,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        moveTask: handleMoveTask,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error('useBoard must be used within BoardProvider');
  return ctx;
};

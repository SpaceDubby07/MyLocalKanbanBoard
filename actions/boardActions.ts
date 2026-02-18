'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { Board, Task } from '@/types';

// Helper to get absolute path (works in dev & when built)
const dataPath = path.join(process.cwd(), 'data', 'boards.json');

async function readBoards(): Promise<Board[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await writeBoards([]);
    return [];
  }
}

async function writeBoards(boards: Board[]) {
  await fs.writeFile(
    dataPath,
    JSON.stringify(boards, null, 2),
    'utf-8',
  );
}

export async function getBoards() {
  return readBoards();
}

export async function createBoard(name: string) {
  const boards = await readBoards();
  const newBoard: Board = {
    id: crypto.randomUUID(),
    name: name.trim(),
    columns: { today: [], thisWeek: [], future: [], completed: [] },
  };
  const updated = [...boards, newBoard];
  await writeBoards(updated);
  return newBoard;
}

export async function deleteBoard(id: string) {
  const boards = await readBoards();
  const updated = boards.filter((b) => b.id !== id);
  await writeBoards(updated);
  return updated;
}

export async function addTask(
  boardId: string,
  columnId: 'today' | 'thisWeek' | 'future' | 'completed',
  title: string,
) {
  const boards = await readBoards();
  const board = boards.find((b) => b.id === boardId);
  if (!board) throw new Error('Board not found');

  const newTask: Task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
  };

  board.columns[columnId].push(newTask);
  await writeBoards(boards);
  return newTask;
}

export async function updateTask(
  boardId: string,
  columnId: 'today' | 'thisWeek' | 'future' | 'completed',
  taskId: string,
  updates: Partial<Task>,
) {
  const boards = await readBoards();
  const board = boards.find((b) => b.id === boardId);
  if (!board) throw new Error('Board not found');

  const tasks = board.columns[columnId];
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  await writeBoards(boards);
  return tasks[taskIndex];
}

export async function deleteTask(
  boardId: string,
  columnId: 'today' | 'thisWeek' | 'future' | 'completed',
  taskId: string,
) {
  const boards = await readBoards();
  const board = boards.find((b) => b.id === boardId);
  if (!board) throw new Error('Board not found');

  board.columns[columnId] = board.columns[columnId].filter(
    (t) => t.id !== taskId,
  );
  await writeBoards(boards);
}

// Add at the bottom
export async function moveTask(
  boardId: string,
  sourceColumnId: 'today' | 'thisWeek' | 'future' | 'completed',
  destColumnId: 'today' | 'thisWeek' | 'future' | 'completed',
  taskId: string,
): Promise<void> {
  const boards = await readBoards();
  const boardIndex = boards.findIndex((b) => b.id === boardId);
  if (boardIndex === -1) throw new Error('Board not found');

  const sourceTasks = boards[boardIndex].columns[sourceColumnId];
  const taskIndex = sourceTasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) throw new Error('Task not found');

  const task = sourceTasks.splice(taskIndex, 1)[0];
  boards[boardIndex].columns[destColumnId].push(task);

  await writeBoards(boards);
}

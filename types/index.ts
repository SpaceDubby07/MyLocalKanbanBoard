export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Column {
  id: 'today' | 'thisWeek' | 'future';
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  columns: {
    today: Task[];
    thisWeek: Task[];
    future: Task[];
    completed: Task[];
  };
}

export interface Task {
  id?: string; // optional for new tasks
  title: string;
  description: string;
  date: string; // format: YYYY-MM-DD
  startTime?: string; // optional if allDay is true
  endTime?: string;
  allDay: boolean;
  color: string;
  assignedTo: string[]; // array of user IDs or names
  createdAt: number;
}

export interface TaskInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color: string;
  assignees: string[]; // user IDs
  createdAt: number;
}

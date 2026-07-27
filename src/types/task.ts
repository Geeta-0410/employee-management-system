export interface Task {
  _id?: string;

  title: string;

  priority: "High" | "Normal" | "Low";

  status: "In Progress" | "To Do";

  dueDate: string;
}
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { getTasks, addTask } from "../services/taskService";
import { deleteTask, updateTask } from "../services/taskService";
interface Task {
  _id?: string;
  title: string;
  priority: string;
  status: string;
  dueDate: string;
}

function EmployeeTasks() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");

  const [priority, setPriority] = useState("Normal");

  const [status, setStatus] = useState("In Progress");

  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

  const loadTasks = async () => {
    try {
      const res = await getTasks();

      console.log("TASKS =>", res.data);

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title || !priority || !status || !dueDate) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await updateTask(editingId, {
          title,
          priority,
          status,
          dueDate,
        });

        toast.success("Task Updated");
      } else {
        await addTask({
          title,
          priority,
          status,
          dueDate,
        });

        toast.success("Task Added");
      }

      setEditingId(null);

      setTitle("");
      setPriority("Normal");
      setStatus("In Progress");
      setDueDate("");

      loadTasks();
    } catch (error) {
      console.error(error);

      toast.error("Failed to add task");
    }
  };

  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  const handleEdit = (task: Task) => {
    setEditingId(task._id || "");

    setTitle(task.title);

    setPriority(task.priority);

    setStatus(task.status);

    setDueDate(task.dueDate);
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);

      toast.success("Task Deleted");

      loadTasks();
    } catch {
      toast.error("Delete Failed");
    }
  };

  const getDueDateStyle = (dueDate: string) => {
    const today = new Date();

    const due = new Date(dueDate);

    const diff = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff < 0) return "text-red-700 font-bold";

    if (diff <= 2) return "text-orange-600 font-bold";

    return "text-slate-700";
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastTask = currentPage * tasksPerPage;

  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  return (
    <div className="min-h-screen bg-slate-200 ">
   <div
  className="
    fixed
    top-10
    left-0
    right-0
    z-30
    bg-slate-700
    px-8
    py-6
    shadow-lg
  "
>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="
          p-2
          rounded-full
          bg-white
          shadow
          hover:bg-slate-100
          transition
        "
      >
        <FaArrowLeft />
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white">
          My Tasks
        </h1>

        <p className="text-slate-300 mt-1">
          Manage and track your assigned tasks.
        </p>
      </div>
    </div>

    <input
      type="text"
      placeholder="Search Task..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="
        px-4 py-2
        rounded-xl
        border
        bg-white
        w-72
        outline-none
      "
    />
  </div>
</div>

      {/* Add Task Form */}

      <div className="bg-slate-200 rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Add Task</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Task Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-xl p-3"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option value="High">High</option>

            <option value="Normal">Normal</option>

            <option value="Low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl p-3"
          >
            <option value="In Progress">In Progress</option>

            <option value="To Do">To Do</option>
            <option value="Completed">Completed</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-xl p-3"
          />
        </div>

        <button
          onClick={handleAddTask}
          className="
    mt-5
    bg-slate-800
    text-white
    px-6
    py-3
    rounded-xl
    hover:bg-slate-700
  "
        >
          {editingId ? "Update Task" : "Add Task"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-slate-500">Total Tasks</h3>

            <p className="text-3xl font-bold">{tasks.length}</p>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl shadow">
            <h3 className="text-yellow-600">In Progress</h3>

            <p className="text-3xl font-bold">{inProgressTasks.length}</p>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl shadow">
            <h3 className="text-blue-600">To Do</h3>

            <p className="text-3xl font-bold">{todoTasks.length}</p>
          </div>

          <div className="bg-green-50 p-5 rounded-2xl shadow">
            <h3 className="text-green-600">Completed</h3>

            <p className="text-3xl font-bold">{completedTasks.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow mt-8">
          <h2 className="text-xl font-bold mb-4">All Tasks</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Task</th>

                <th className="text-left py-3">Priority</th>

                <th className="text-left py-3">Status</th>

                <th className="text-left py-3">Due Date</th>

                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentTasks.map((task) => (
                <tr key={task._id} className="border-b">
                  <td className="py-3">{task.title}</td>

                  <td className="py-3">
                    <span
                      className={`
px-3 py-1 rounded-full text-sm font-medium
${
  task.priority === "High"
    ? "bg-red-100 text-red-700"
    : task.priority === "Low"
      ? "bg-gray-100 text-gray-700"
      : "bg-blue-100 text-blue-700"
}
`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={`
px-3 py-1 rounded-full text-sm font-medium
${
  task.status === "Completed"
    ? "bg-green-100 text-green-700"
    : task.status === "To Do"
      ? "bg-slate-100 text-slate-700"
      : "bg-yellow-100 text-yellow-700"
}
`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className={`py-3 ${getDueDateStyle(task.dueDate)}`}>
                    {task.dueDate}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-500"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(task._id!)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="
      px-4 py-2
      bg-slate-200
      rounded-lg
      disabled:opacity-50
    "
            >
              Prev
            </button>

            <span className="font-medium">
              {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="
      px-4 py-2
      bg-slate-800
      text-white
      rounded-lg
      disabled:opacity-50
    "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeTasks;

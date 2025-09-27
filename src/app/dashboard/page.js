"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskModal from "@/components/TaskModal/TaskModal";
import TaskCard from "@/components/TaskCard/TaskCard";
import "./dashboard.css";
import { useAuth } from "@/context/AuthContext";
import {
  createTaskService,
  deleteTaskService,
  getTasks,
  updateTaskService,
} from "@/api/tasks";
import TaskCardForm from "@/components/TaskCardForm/TaskCardForm";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "",
    assignee: "",
    dueDate: "",
  });

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("taskId");
    if (!id) return;
    const originalTasks = [...tasks];
    const updatedTasks = tasks
      ? tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      : [];
    setTasks(updatedTasks);
    try {
      const res = await updateTaskService(id, { status: newStatus });
      if(res.error){
        throw new Error(res.error);
      }
    } catch (error) {
      setTasks(originalTasks);
      console.error("Error updating task status:", error);
      if(error.message === "Unauthorized"){
        logout();
        router.push("/login");
      }
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const handleCreateTask = (status) => {
    setIsAdding(true);
    setNewTask({
      title: "",
      description: "",
      status,
      assignee: "",
      dueDate: "",
    });
  };

  const handleDelete = async (id) => {
    const originalTasks = [...tasks];
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    try {
      const res = await deleteTaskService(id);
      if (res.error) {
        throw new Error(res.error);
      }
      setSelectedTask(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setTasks(originalTasks);
      if (error.message === "Unauthorized") {
        logout();
        router.push("/login");
      }
    }
  };

  async function fetchTasks() {
    try {
      const res = await getTasks();
      if (res.error) {
        throw new Error(res.error);
      }
      const normalized = res.map((t) => ({
        ...t,
        id: t._id || t.id,
      }));
      setTasks(normalized);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.message === "Unauthorized") {
        logout();
        router.push("/login");
      }
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboardContainer">
      <h2 className="title">Dashboard</h2>
      <div className="boardContainer">
        {["todo", "in_progress", "done"].map((status) => (
          <div
            className={`statusColumn ${status}`}
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={allowDrop}
          >
            <div className="columnHeader">
              <h3 className={status} style={{ textTransform: "uppercase" }}>
                {status.replace("_", " ")}
              </h3>
              <button className="addButton" onClick={() => handleCreateTask(status)}>
                Add
              </button>
            </div>

            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => setSelectedTask(task)}
                />
              ))}

            {isAdding && newTask.status === status && (
              <TaskCardForm
                key="new-task"
                status={status}
                onCancel={() => setIsAdding(false)}
                onSave={async (nt) => {
                  try {
                    const res = await createTaskService(nt);
                    if (res.error) throw new Error(res.error);
                    await fetchTasks();
                    setIsAdding(false);
                  } catch (err) {
                    console.error("Error creating task:", err);
                    if (err.message === "Unauthorized") {
                      logout();
                      router.push("/login");
                    }
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onDelete={handleDelete}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
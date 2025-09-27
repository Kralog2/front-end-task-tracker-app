import { apiFetch } from "@/utils/utils";

function safeId(id) {
  if (typeof id !== "string") throw new Error("Invalid task id");
  return id;
}

export async function createTaskService(data) {
  try {
   const result = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    return { error: error.message || "Failed to create task." };
  }
}

export async function getTasks() {
  try {
    return await apiFetch("/tasks", { method: "GET" });
  } catch (error) {
    return { error: error.message || "Failed to fetch user." };
  }
}

export async function updateTaskService(id, data) {
  try {
    const safe = safeId(id);
    const result = await apiFetch(`/tasks/${safe}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    return { error: error.message || "Failed to update task." };
  }
}

export async function deleteTaskService(id) {
  try {
    const safe = safeId(id);
    const result =  await apiFetch(`/tasks/${safe}`, {
      method: "DELETE",
    });
    return result;
  } catch (error) {
    return { error: error.message || "Failed to delete task." };
  }
}

import { useState } from "react";
import "./TaskCardForm.css";

const MAX_TITLE_LENGTH = 200;
const MAX_DESC_LENGTH = 1000;

export default function TaskCardForm({ status, onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      alert("Title is required.");
      return;
    }
    if (title.length > MAX_TITLE_LENGTH) {
      alert(`Title must be ≤ ${MAX_TITLE_LENGTH} characters.`);
      return;
    }
    if (description.length > MAX_DESC_LENGTH) {
      alert(`Description must be ≤ ${MAX_DESC_LENGTH} characters.`);
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      status: status || "todo",
    });
  };

  return (
    <div className="taskCardContainer">
      <form onSubmit={handleSubmit} className="formContainer">
        <input
          type="text"
          className="input"
          placeholder="Task title..."
          maxLength={MAX_TITLE_LENGTH}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input"
          placeholder="Description..."
          maxLength={MAX_DESC_LENGTH}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="formActions">
          <button type="submit" className="submitButton">
            Save
          </button>
          <button type="button" className="cancelButton" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

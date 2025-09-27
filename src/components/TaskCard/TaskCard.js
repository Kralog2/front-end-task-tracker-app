import "./TaskCard.css";

export default function TaskCard({ task = {}, onClick, onDragStart }) {
  const {
    title = "",
    description = "",
    createdAt,
    dueDate,
  } = task;
  
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="taskCardContainer"
    >
      <h4 className="taskTitle">{title}</h4>
      <p>
        <strong>Description:</strong> {description}
      </p>
      <p>
        <strong>Created:</strong> {formatDate(createdAt)}
      </p>
      <p>
        <strong>Due:</strong> {dueDate ? formatDate(dueDate) : "N/A"}
      </p>
    </div>
  );
}

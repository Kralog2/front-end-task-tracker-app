import "./TaskModal.css";

export default function TaskModal({ task = {}, onDelete, onClose }) {
  const {
    title = "",
    description = "",
    status = "",
    assignedTo = "",
    createdAt,
    dueDate,
    id,
  } = task;

  const formatDate = (dStr) => {
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <h2>{title}</h2>
        <p>
          <strong>Descripción:</strong> {description}
        </p>
        <p>
          <strong>Estatus:</strong> {status}
        </p>
        <p>
          <strong>Asignado a:</strong> {assignedTo}
        </p>
        <p>
          <strong>Creada:</strong> {formatDate(createdAt)}</p>
        <p>
          <strong>Vence:</strong> {dueDate ? formatDate(dueDate) : "N/A"}
        </p>

        <button
          className="deleteButton"
          onClick={() => {
            if (id != null) onDelete(id);
          }}
        >
          Delete
        </button>
        <button onClick={onClose} className="closeButton">
          Close
        </button>
      </div>
    </div>
  );
}


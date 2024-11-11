import { useState } from "react";
import { FaCheck, FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function Card({ id, fullName, email, role, onChangedRole }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState(role);

  const handleEdit = () => {
    setIsEditing(editing => !editing);
    if (isEditing) onChangedRole(id, newRole);
  }

  return (
    <li className="card" style={({ width: "20rem" })}>
      <div className="card-body">
        <h5 className="card-title">Name: {fullName}</h5>
        <span className="card-text">{!isEditing ? <p>Role: {role}</p> : (
          <select className="form-select" value={newRole} onChange={event => setNewRole(event.target.value)} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          )}
        </span>
      </div>
      <div className="card-footer">
        <button onClick={handleEdit} className={`btn btn-sm me-2 ${isEditing ? "btn-outline-success" : "btn-outline-primary"}`}>
          {isEditing ? <FaCheck /> : <FaPencilAlt />}
        </button>
        <button className="btn btn-outline-danger btn-sm"><FaTrash /></button>
      </div>
    </li>
  );
}
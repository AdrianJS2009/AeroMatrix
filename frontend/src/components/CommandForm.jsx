import React, { useState } from "react";
import { executeCommands } from "../services/api";

export default function CommandForm({ droneId }) {
  const [commands, setCommands] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await executeCommands(droneId, commands);
      setMessage("Commands executed successfully!");
    } catch (error) {
      setMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="p-4">
      <h4>Send Commands</h4>
      <form onSubmit={handleSubmit}>
        <select
          multiple
          value={commands}
          onChange={(e) =>
            setCommands([...e.target.selectedOptions].map((o) => o.value))
          }
        >
          <option value="TURN_LEFT">Turn Left</option>
          <option value="TURN_RIGHT">Turn Right</option>
          <option value="MOVE_FORWARD">Move Forward</option>
        </select>
        <button type="submit" className="btn btn-success">
          Execute
        </button>
      </form>
      {message && <div className="alert alert-info mt-2">{message}</div>}
    </div>
  );
}

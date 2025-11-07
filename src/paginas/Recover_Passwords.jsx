import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Recover() {
  const [Email, setEmail] = useState("");
  const [confrmEmail, setConfirmEmail] = useState("");
  const [Token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar correo</label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <button type="submit" className="registro-button">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

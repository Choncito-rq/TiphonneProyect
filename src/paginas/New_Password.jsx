import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";

export default function VerifyToken() {
  const [Contraseña, setContraseña] = useState("");
  const [ConfirmContraseña, setConfirmContraseña] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Contraseña !== ConfirmContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        <h2 className="registro-title">Nueva Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="email"
              value={Contraseña}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="**********"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input
              type="email"
              value={ConfirmContraseña}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="**********"
              required
            />
          </div>

          <button type="submit" className="registro-button">
            Ingresar Nueva Contraseña
          </button>
        </form>

      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const email = localStorage.getItem("Email");

    const body = {
      correo: email,
      nueva_contraseña: password
    };

    try {
      const resp = await fetch("http://localhost:5173/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();

      if (resp.ok) {
        console.log("Contraseña actualizada");
        navigate("/");
      } else {
        alert("Error: " + (data.error || "No se pudo actualizar la contraseña"));
      }
    } catch (err) {
      console.log("Error enviando datos:", err);
      alert("No se pudo conectar con el servidor");
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="**********"
              required
            />
          </div>

          <button type="submit" className="registro-button">
            Guardar Nueva Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

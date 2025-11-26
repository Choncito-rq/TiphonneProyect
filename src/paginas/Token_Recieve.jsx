import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nuevoToken } from "./Recover_Passwords";


export default function VerifyToken() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  if (token === "") {
    alert("Coloque su token");
    return;
  }

  const tokenGuardado = localStorage.getItem("token_recuperacion");

  if (tokenGuardado && tokenGuardado.trim() === token.trim()) {
    navigate("/Recovered/NewPassword");
  } else {
    console.log("Token incorrecto");
  }
};


  return (
    <div className="recover-container">
      <div className="registro-card">
        <h2 className="registro-title">Verificar Token</h2>
        <p className="token-instruction">
          Introduce el token de recuperación que te enviamos por correo
          electrónico.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Token de verificación</label>
            <textarea
              className="token-input"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ejemplo: Ab3x-Yu6T-Qz9P"
              rows="3"
              required
            />
          </div>

          <button type="submit" className="registro-button">
            Verificar Token
          </button>
        </form>
      </div>
    </div>
  );
}

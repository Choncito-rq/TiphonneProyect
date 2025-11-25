import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registro.css";
export const nuevoToken = generarToken();
function generarToken(longitud = 8) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+*_/<>";
  let token = "";
  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(indiceAleatorio);
  }

  return token;
}

export default function Recover() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      alert("Los correos no coinciden");
      return;
    }

    setToken(nuevoToken);

   await fetch("http://localhost:4000/send-token", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email,
    token: nuevoToken
  })
});


    navigate("/Verify");
  };

  return (
    <div className="recover-container">
      <div className="recover-card">
        <h2 className="registro-title">Recuperar Cuenta</h2>

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
            Generar Token
          </button>
        </form>

      </div>
    </div>
  );
}

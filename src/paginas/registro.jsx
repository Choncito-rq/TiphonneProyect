import { useState } from "react";

export default function Registro_nuevo() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Se envio:", email, confirmEmail, password, confirmPassword);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Registro Nuevo</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label>Confirmar correo:</label><br />
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder="repite tu correo"
            required
          />
        </div>

        <div>
          <label>Contraseña:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <div>
          <label>Confirmar contraseña:</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Registrarse
        </button>
      </form>
    </div>
  );
}
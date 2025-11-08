import { useState } from "react";
import "./Registro.css";
import { useNavigate } from "react-router-dom";

export default function Registro_nuevo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apellido, setApellido] = useState("");
  const navegar = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    //Aqui debe de ir la conexion con API de Python
    try {
      const response = await fetch(
        "https://tiphonne-api-render.onrender.com/users/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom_1: name,
            app_1: apellido,
            correo: email,
            contraseña: password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.mensaje || "Usuario registrado con éxito");
        navegar("/");
      } else {
        alert(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("Hubo un problema con el servidor.");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h1 className="registro-title">Crear Cuenta</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre de usuario</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div className="input-group">
            <label>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="ej. manzanillo"
              required
            />
          </div>
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
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
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

import { useState } from "react";

import "./App.css";

function Login() {
  const [pswd, setPswd] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //logica de validacion de correo
    if ((pswd == "1234") & (email === "luis@gmail.com")) {
      alert("listo");
      token = generateToken();
    } else {
      alert("datos incorrectos");
    }
  };
  return (
    <div className="login-container">
      <h1>Login :D</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          value={pswd}
          placeholder="Contraseña"
          onChange={(e) => setPswd(e.target.value)}
          required
        />
        <button className="login-button" type="submit">
          Iniciar sesión
        </button>
        <a className="login-a" href="#">
          Olvidé mi contraseña
        </a>
      </form>
    </div>
  );
}
export default function App() {
  return <Login />;
}

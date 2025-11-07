import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navegar = useNavigate();
  const [pswd, setPswd] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((pswd == "1234") & (email === "luis@gmail.com")) {
      alert("listo");
      navegar("/home");
      //token = generateToken();
    } else {
      alert("datos incorrectos");
    }
  };
  return (
    <div className="main-container">
      <h1>Bienvenido</h1>
      <form className="main-form" onSubmit={handleSubmit}>
        <input
          className="main-input"
          type="email"
          value={email}
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="main-input"
          type="password"
          value={pswd}
          placeholder="Contraseña"
          onChange={(e) => setPswd(e.target.value)}
          required
        />

        <button className="login-button" type="submit">
          Iniciar sesión
        </button>
        <div className="login-optional">

        <a
          onClick={() => navegar("/Recovered")}
          className="login-a"
          to="/Recover_Passwords"
        >
          Olvide mi Contraseña
        </a>

        <a
          onClick={() => navegar("/Registrarme")}
          className="login-a"
          to="/registro"
        >
          Registrarme
        </a>
        </div>
      </form>
    </div>
  );
}

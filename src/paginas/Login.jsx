import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  //constante navegar para navgar al home
  const navegar = useNavigate();
  //variables de contraseña y correo
  const [pswd, setPswd] = useState("");
  const [email, setEmail] = useState("");
  //estado para activar el loading dentro del boton
  const [loading, setLoading] = useState(false);
  //funcion para manejar el evento del boton(hace una peticion a la api del usuario con la contraseña, si esta, el login es correcto)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://tiphonne-api-render.onrender.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: email, contraseña: pswd }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("okey");
        localStorage.setItem(
          "user",
          JSON.stringify({
            usuario: data.usuario,
          })
        );
        localStorage.setItem("iduser", data.id);
        localStorage.setItem("token", data.token); // Falta que el backend genere el token
        navegar("/home"); //si hay una respuesta, si hay contenido, voy al home(pagina principal)
      } else {
        alert("Datos incorrectos");
      }
    } catch (error) {
      console.log(error);
    } finally {
      //despues de finalizar la peticion a la api, independientemente si dio bien o mal, finalmente cierra la animacion de loading en el boton
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <form className="main-form" onSubmit={handleSubmit}>
        <h1>Bienvenido</h1>

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

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Iniciar sesión"}
        </button>

        <div className="login-optional">
          <a onClick={() => navegar("/Recovered")} className="login-a">
            Olvide mi Contraseña
          </a>
          <a onClick={() => navegar("/Registrarme")} className="login-a">
            Registrarme
          </a>
        </div>
      </form>
    </div>
  );
}

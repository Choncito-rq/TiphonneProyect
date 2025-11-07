import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

const [Email, setEmail] = useState("");
const [confrmEmail, setConfirmEmail] = useState("");

export default function Recover() {

    return(
        <div className="recover-container">
      <div className="recover-card">
        <h1 className="recover-title">Crear Cuenta</h1>

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
    )
}
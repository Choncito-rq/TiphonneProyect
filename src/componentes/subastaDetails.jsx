import { useState } from "react";
import "./subastaDetails.css";
import { useEffect } from "react";

export default function SubastaDetails({
  id_subasta,
  descripcion,
  fecha_ini,
  fecha_fin,
  precio_base,
  puja_actual,
  imagenes,
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [user, setUser] = useState(null);
  const [imagenActual, setImagenActual] = useState(
    imagenes[0] || "https://picsum.photos/400/300"
  );

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userParsed = stored ? JSON.parse(stored) : null;
    setUser(userParsed);
  }, []);

  const handlePujar = async () => {

    try {
      const response = await fetch("https://tiphonne-api-render.onrender.com/subastas/pu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario_pujador: user?.usuario?.id,
          id_subasta: id_subasta,
          monto: monto,
        }),

      });
      const data = await response.json();
      console.log("Puja enviada:", data);

      alert("Puja realizada correctamente");
      setMostrarModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al pujar");
    }
  };

  const cambiarImagen = (src) => {
    setImagenActual(src);
  };

  return (
    <>
      <article className="auction-details">
        <div className="auction-left">
          <div className="main-image">
            <img src={imagenActual} alt="Imagen principal" />
          </div>

          <div className="image-thumbs">
            {imagenes.length > 0
              ? imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="mini"
                    onClick={() => cambiarImagen(img)}
                    className="thumb-img"
                  />
                ))
              : [1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/100/10${i}`}
                    alt="mini"
                    onClick={() =>
                      cambiarImagen(`https://picsum.photos/400/30${i}`)
                    }
                    className="thumb-img"
                  />
                ))}
          </div>
        </div>

        <div className="auction-right">
          <h2>Subasta #{id_subasta}</h2>

          <p className="current-bid">
            Puja actual: <span>{puja_actual?.monto || precio_base}</span>
          </p>

          <p>Precio base: {precio_base}</p>

          <div className="bid-actions">
            <button
              className="primary-btn"
              onClick={() => setMostrarModal(true)}
            >
              Pujar
            </button>
            <button className="secondary-btn">Historial</button>
          </div>

          <p className="description">{descripcion}</p>
          <p className="dates">
            <span>Inicio:</span> {fecha_ini} <br />
            <span>Fin:</span> {fecha_fin}
          </p>
        </div>
      </article>

      {mostrarModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Realizar puja</h3>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingresa tu oferta"
            />
            <button className="primary-btn" onClick={handlePujar}>
              Confirmar
            </button>
            <button
              className="secondary-btn"
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

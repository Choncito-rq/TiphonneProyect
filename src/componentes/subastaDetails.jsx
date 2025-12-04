import { useState } from "react";
import "./subastaDetails.css";

export default function SubastaDetails({
  id_subasta,
  descripcion,
  titulo,
  fecha_ini,
  fecha_fin,
  precio_base,
  puja_actual,
  imagenes = [],
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [imagenActual, setImagenActual] = useState(
    imagenes[0] || "https://picsum.photos/400/300"
  );

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user?.usuario?.id);
  const handlePujar = async () => {
    if (!monto || Number(monto) <= (puja_actual?.monto ?? precio_base)) {
      alert("La puja debe ser mayor a la actual.");
      return;
    }

    try {
      const response = await fetch(
        `https://tiphonne-api-render.onrender.com/subastas/${id_subasta}/pujas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: user?.usuario?.id,

            puja: monto,
          }),
        }
      );
      /*   id_usuario=data['id_usuario'],
                id_subasta=id_subasta,
                puja=data['puja']*/
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al realizar la puja");
        setMostrarModal(false);
        return;
      }

      alert("Puja realizada correctamente");
      setMostrarModal(false);
    } catch (error) {
      alert("Error al pujar");
    }
  };

  return (
    <>
      <article className="auction-details">
        <div className="auction-left">
          <img
            className="main-image"
            src={imagenActual}
            alt="Imagen principal"
          />

          <div className="image-thumbs">
            {(imagenes.length > 0
              ? imagenes
              : [
                  "https://picsum.photos/400/301",
                  "https://picsum.photos/400/302",
                  "https://picsum.photos/400/303",
                ]
            ).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="mini"
                onClick={() => setImagenActual(img)}
                className="thumb-img"
              />
            ))}
          </div>
        </div>

        <div className="auction-right">
          <h2>{titulo}</h2>

          <p className="current-bid">
            Puja actual: <span>{puja_actual?.monto ?? precio_base}</span>
          </p>

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
              min="1"
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

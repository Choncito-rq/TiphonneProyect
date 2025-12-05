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
  id_usuario_creador, // ← AGREGADO
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [imagenActual, setImagenActual] = useState(
    imagenes[0] || "https://picsum.photos/400/300"
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const idUser = user?.usuario?.id;

  // Si el usuario actual es el dueño de la última puja
  const esDuenioDeLaPuja = puja_actual?.id_usuario_pujador === idUser;

  // Si el usuario actual creó la subasta
  const esDuenioDeLaSubasta = id_usuario_creador === idUser;

  const handlePujar = async () => {
    // Evitar que el dueño de la subasta puje
    if (esDuenioDeLaSubasta) {
      alert("No puedes pujar en tu propia subasta.");
      return;
    }

    // Evitar que supere su propia puja
    if (esDuenioDeLaPuja) {
      alert("No puedes superar tu propia oferta.");
      return;
    }

    // Validar monto mayor
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
            id_usuario: idUser,
            puja: monto,
          }),
        }
      );

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

          {esDuenioDeLaPuja && (
            <p className="duenio-oferta">Eres dueño de la oferta más alta</p>
          )}

          {esDuenioDeLaSubasta && (
            <p className="duenio-subasta">
              Eres el creador de la subasta. No puedes pujar.
            </p>
          )}

          <p className="current-bid">
            Puja actual: <span>{puja_actual?.monto ?? precio_base}</span>
          </p>

          {/* Mostrar botones solo si NO es dueño */}
          {!esDuenioDeLaPuja && !esDuenioDeLaSubasta && (
            <div className="bid-actions">
              <button
                className="primary-btn"
                onClick={() => setMostrarModal(true)}
              >
                Pujar
              </button>
              <button className="secondary-btn">Historial</button>
            </div>
          )}

          {esDuenioDeLaPuja && (
            <p className="info-puja">No puedes superar tu propia puja.</p>
          )}

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

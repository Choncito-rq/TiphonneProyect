import { useState, useEffect } from "react";
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
  id_usuario_creador,
  categorias = [],
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [monto, setMonto] = useState("");
  const [imagenActual, setImagenActual] = useState(
    imagenes[0] || "https://picsum.photos/400/300"
  );

  const [tituloEdit, setTituloEdit] = useState(titulo);
  const [descripcionEdit, setDescripcionEdit] = useState(descripcion);

  const user = JSON.parse(localStorage.getItem("user"));
  const idUser = user?.usuario?.id;

  const esDuenioDeLaPuja = puja_actual?.id_usuario_pujador === idUser;
  const esDuenioDeLaSubasta = id_usuario_creador === idUser;
  const [tiempoRestante, setTiempoRestante] = useState("");
  const calcularTiempoRestante = () => {
    const fin = new Date(fecha_fin).getTime();
    const ahora = Date.now();
    const diferencia = fin - ahora;

    if (diferencia <= 0) {
      return "Finalizada";
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  };
  useEffect(() => {
    setTiempoRestante(calcularTiempoRestante());

    const interval = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante());
    }, 1000);

    return () => clearInterval(interval);
  }, [fecha_fin]);

  const handleGuardarCambios = async () => {
    try {
      const response = await fetch(
        `https://tiphonne-api-render.onrender.com/subastas/${id_subasta}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: tituloEdit,
            descripcion: descripcionEdit,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al actualizar la subasta");
        return;
      }

      alert("Subasta actualizada correctamente");
    } catch (e) {
      alert("Error al guardar los cambios");
    }
  };

  const handlePujar = async () => {
    if (esDuenioDeLaSubasta) {
      alert("No puedes pujar en tu propia subasta.");
      return;
    }
    if (esDuenioDeLaPuja) {
      alert("No puedes superar tu propia oferta.");
      return;
    }

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
            {(imagenes.length
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
          <p className="time-left">
            Tiempo restante: <span>{tiempoRestante}</span>
          </p>
          {esDuenioDeLaSubasta ? (
            <input
              className="editable-input"
              value={tituloEdit}
              onChange={(e) => setTituloEdit(e.target.value)}
              maxLength={80}
            />
          ) : (
            <h2>{titulo}</h2>
          )}
          {categorias.length > 0 && (
            <div className="categorias-box">
              <h4>Categorías:</h4>
              <ul className="categoria-list">
                {categorias.map((c, i) => (
                  <li key={i} className="categoria-item">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {esDuenioDeLaPuja && (
            <p className="duenio-oferta">Eres dueño de la oferta más alta</p>
          )}

          {esDuenioDeLaSubasta && (
            <p className="duenio-subasta">Eres el creador de la subasta.</p>
          )}

          <p className="current-bid">
            Puja actual: <span>{puja_actual?.monto ?? precio_base}</span>
          </p>

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

          {esDuenioDeLaSubasta ? (
            <textarea
              className="editable-textarea"
              value={descripcionEdit}
              onChange={(e) => setDescripcionEdit(e.target.value)}
              maxLength={600}
            />
          ) : (
            <p className="description">{descripcion}</p>
          )}

          <p className="dates">
            <span>Inicio:</span> {fecha_ini} <br />
            <span>Fin:</span> {fecha_fin}
          </p>

          {esDuenioDeLaSubasta && (
            <button className="save-btn" onClick={handleGuardarCambios}>
              Guardar cambios
            </button>
          )}
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

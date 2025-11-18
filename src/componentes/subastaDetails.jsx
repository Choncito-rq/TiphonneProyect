import { useState } from "react";
import "./subastaDetails.css";

export default function SubastaDetails({
  titulo,
  imagen,
  puja_actual,
  fecha_fin,
  descripcion,
  fecha_inicio,
  tiempo_restante,
  precio_inicial,
}) {
  //const [imagenPrincipal, setImagenPrincipal] = useState();
  const handlePujar = async (e) => {
    e.preventDefault();
    console.log("pujado :DDD");
  };

  return (
    <article className="auction-details">
      <div className="auction-left">
        <div className="main-image">
          <img src={imagen} alt={titulo} />
        </div>
        <div className="image-thumbs">
          {[1, 2, 3].map((i) => (
            <img key={i} src={`https://picsum.photos/100/10${i}`} alt="mini" />
          ))}
        </div>
      </div>

      <div className="auction-right">
        <h2>{titulo}</h2>
        <p className="current-bid">
          Puja actual: <span>{puja_actual}</span>
        </p>
        <p className="starting-bid">Precio inicial: {precio_inicial}</p>
        <div className="timer">⏰ {tiempo_restante}</div>

        <div className="bid-actions">
          <button className="primary-btn">Pujar</button>
          <button className="secondary-btn">Historial</button>
        </div>

        <p className="description">{descripcion}</p>
        <p className="dates">
          <span>Inicio:</span> {fecha_inicio} <br />
          <span>Fin:</span> {fecha_fin}
        </p>
      </div>
    </article>
  );
}

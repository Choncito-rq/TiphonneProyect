import React from "react";
import "./CardSubasta.css";
import { useNavigate } from "react-router-dom";
export default function CardSubasta({ id, titulo, imagen, precio, fechafin }) {
  const navegar = useNavigate();

  return (
    <div className="card-sub" onClick={() => console.log("Redireccionando...")}>
      <img className="card-sub-img" src={imagen} alt={titulo}></img>\
      <div className="card-sub-body">
        <h3 className="card-sub-titulo">{titulo}</h3>
        <p className="card-sub-precio">{precio}</p>
        <p className="card-sub-fin">{fechafin}</p>
      </div>
    </div>
  );
}

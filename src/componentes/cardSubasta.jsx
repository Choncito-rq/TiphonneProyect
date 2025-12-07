import "./CardSubasta.css";
import { useNavigate } from "react-router-dom";

export default function CardSubasta({
  id,
  titulo,
  imagen,
  precio,
  fechafin,
  categorias = [],
  onCardClick, 
}) {
  const navegar = useNavigate();

  const handleClick = () => {
    if (typeof onCardClick === "function") {
      onCardClick();
    }
  };

  return (
    <div className="card-sub" onClick={onCardClick ? handleClick : undefined}>
      <img className="card-sub-img" src={imagen} alt={titulo} />

      <div className="card-sub-body">
        <h3 className="card-sub-titulo">{titulo}</h3>

        {categorias.length > 0 && (
          <div className="card-sub-categorias">
            {categorias.map((cat, i) => (
              <span key={i} className="cat-chip">
                {cat}
              </span>
            ))}
          </div>
        )}

        <p className="card-sub-precio">₡ {precio}</p>
        <p className="card-sub-fin">{fechafin}</p>
      </div>
    </div>
  );
}

import { useState } from "react";
export default function Galeria(imagenes = []) {
  const [imagenPrincipal, setImagenPrincipal] = useState(imagenes[0]);

  return (
    <>
      <div className="galeria">
        {imagenPrincipal && (
          <img src={imagenPrincipal} className="imagen-principal" />
        )}
      </div>
      <div className="miniaturas">
        {imagenes.map((img, index) => (
          <img key={index} src={img} onClick={() => setImagenPrincipal(img)} />
        ))}
      </div>
    </>
  );
}

import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";
import Modal from "../componentes/model";
import SubastaDetails from "../componentes/subastaDetails";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubasta, setSelectedSubasta] = useState(null);
  //datos simulados de subastas
  const subastas = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    titulo: `Artículo ${i + 1}`,
    imagen: `https://picsum.photos/400/30${i}`,
    precio_inicial: `${(Math.random() * 500).toFixed(2)} USD`,
    puja_actual: `${(Math.random() * 700).toFixed(2)} USD`,
    fecha_inicio: "10/11/2025",
    fecha_fin: "23/02/2025",
    descripcion:
      "Este es un artículo de ejemplo para subasta. el cual tiene como singularidad ser explallido con el fin de probar la cantidad de",
    tiempo_restante: "3 horas",
  }));
  //manejo de la apertura de los detalles
  const handleOpen = (subasta) => {
    setSelectedSubasta(subasta);
    setIsOpen(true);
  }; //manejo del cierre de los detalles
  const handleClose = () => {
    setSelectedSubasta(null);
    setIsOpen(false);
  };

  return (
    <>
      <Appbar />
      <section className="home-container">
        <h1 className="home-title">Subastas Disponibles</h1>
        <p className="home-subtitle">
          Explora los artículos disponibles y participa en las subastas activas.
        </p>

        <div className="card-container">
          {subastas.map((subasta) => (
            <div key={subasta.id} onClick={() => handleOpen(subasta)}>
              <CardSubasta
                id={subasta.id}
                titulo={subasta.titulo}
                imagen={subasta.imagen}
                precio={subasta.precio_inicial}
                fechafin={subasta.fecha_fin}
              />
            </div>
          ))}
        </div>
      </section>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {selectedSubasta && <SubastaDetails {...selectedSubasta} />}
      </Modal>
    </>
  );
}

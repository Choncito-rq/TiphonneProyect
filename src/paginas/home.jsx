import CardSubasta from "../componentes/cardSubasta";
import "./home.css";
import Appbar from "../componentes/appbar";

export default function Home() {
  return (
    <>
      <Appbar />
      <section className="home-container">
        <h1 className="home-title">Subastas Disponibles</h1>
        <p className="home-subtitle">
          Explora los artículos disponibles y participa en las subastas activas.
        </p>

        <div className="card-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSubasta
              key={i}
              id={i + 1}
              titulo={`Artículo ${i + 1}`}
              imagen={`https://picsum.photos/400/30${i}`}
              precio={`${(Math.random() * 500).toFixed(2)} USD`}
              fechafin="23/02/2025"
            />
          ))}
        </div>
      </section>
    </>
  );
}

import "./subastaDetails.css";

export default function (titulo, imagen, precio, fechafin, descripcion) {
  const handlePujar = async (e) => {
    e.preventDefault();
  };

  return (
    <article className="details-subasta">
      <img src={imagen} alt={titulo}></img>
      <div id="details-left">
        <a id="desc-subasta">{descripcion}</a>
        <button type="submit" onSubmit={handlePujar}>
          {" "}
          Pujar
        </button>
      </div>
    </article>
  );
}

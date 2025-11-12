import { useEffect } from "react";
import "./model.css";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    /*en la renderizacion del modal, si este esta, no se podra scrollear el body*/
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    /*aun si isOpen es false o true, la mera no renderizacion del elemento devuelve un body scrolleable*/
    return () => {
      document.body.style.overflow = "auto";
    };
  });
  //evita que se renderize en el DOM
  if (!isOpen) return null;

  return (
    //tipo contenedor del elemento de subastasdetails.css
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // evita cerrar si clicas dentro
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

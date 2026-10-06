import { CloseButton, Toast, ToastContainer } from "react-bootstrap";

export default function Aviso({ aviso, onCerrar }) {
  return (
    <ToastContainer position="bottom-end" containerPosition="fixed" className="p-3">
      <Toast key={aviso?.id} show={Boolean(aviso)} onClose={onCerrar} delay={4000} autohide bg={aviso?.tipo}>
        <div className="d-flex align-items-start">
          <Toast.Body className="text-white">{aviso?.texto}</Toast.Body>
          <CloseButton variant="white" className="me-2 mt-2" aria-label="Cerrar aviso" onClick={onCerrar} />
        </div>
      </Toast>
    </ToastContainer>
  );
}

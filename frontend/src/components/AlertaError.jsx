import { Alert, Button } from "react-bootstrap";

export default function AlertaError({ error, titulo = "No se pudo completar la operación", onReintentar }) {
  return (
    <Alert variant="danger" className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center justify-content-between">
      <div>
        <strong className="d-block">{titulo}</strong>
        <span>{error.message}</span>
      </div>
      {onReintentar && (
        <Button variant="outline-danger" size="sm" className="flex-shrink-0" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </Alert>
  );
}
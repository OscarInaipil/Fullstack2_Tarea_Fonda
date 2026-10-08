import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import AlertaError from "./AlertaError.jsx";
import { formatearFecha, formatearPesos, nombreMotivo } from "../utils/formato.js";

export default function VentaHistorial({ ventas, cargando, error, onActualizar }) {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-body d-flex align-items-center justify-content-between gap-2">
        <h2 className="h5 mb-0">Historial de ventas</h2>
        <Button size="sm" variant="outline-secondary" onClick={onActualizar} disabled={cargando}>
          {cargando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
              Cargando…
            </>
          ) : (
            "Actualizar"
          )}
        </Button>
      </Card.Header>
      <Card.Body>
        {error && <AlertaError error={error} titulo="No se pudo cargar el historial" onReintentar={onActualizar} />}

        {!cargando && !error && ventas.length === 0 && (
          <p className="text-body-secondary mb-0">Todavía no hay ventas. Registra la primera con el formulario.</p>
        )}

        {ventas.length > 0 && (
          <Table hover className="tabla-apilable align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Bebida</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-end">Unidades</th>
                <th scope="col" className="text-end">Total</th>
                <th scope="col">Estado</th>
                <th scope="col">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => {
                const rechazada = v.estado === "RECHAZADA";
                return (
                  <tr key={v.id} className={rechazada ? "fila-rechazada" : undefined}>
                    <td data-label="Bebida" className="fw-semibold">{v.nombre}</td>
                    <td data-label="Fecha" className="text-nowrap">{formatearFecha(v.fecha)}</td>
                    <td data-label="Unidades" className="text-end">{v.unidades}</td>
                    <td data-label="Total" className="text-end text-nowrap">{rechazada ? "—" : formatearPesos(v.total)}</td>
                    <td data-label="Estado">
                      <Badge bg={rechazada ? "danger" : "success"}>{rechazada ? "Rechazada" : "Autorizada"}</Badge>
                    </td>
                    <td data-label="Motivo">
                      {rechazada ? (
                        <div className="text-end text-md-start">
                          <span className="d-block">{nombreMotivo(v.motivo)}</span>
                          <small className="text-body-secondary">{v.detalle}</small>
                        </div>
                      ) : (
                        <span className="text-body-secondary">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import AlertaError from "./AlertaError.jsx";
import { registrarVenta } from "../services/api.js";
import { formatearPesos, nombreMotivo, nombreTipo } from "../utils/formato.js";

export default function VentaForm({ bebidas, onRegistrada }) {
  const [bebidaId, setBebidaId] = useState("");
  const [unidades, setUnidades] = useState("1");
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);

  const seleccion = bebidas.some((b) => String(b.id) === bebidaId) ? bebidaId : "";

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErrores({});
    setResultado(null);
    try {
      const venta = await registrarVenta(
        seleccion === "" ? null : Number(seleccion),
        unidades === "" ? null : Number(unidades),
      );
      setResultado({ venta });
      setBebidaId("");
      setUnidades("1");
      onRegistrada();
    } catch (err) {
      if (err.status === 400 && Object.keys(err.campos).length > 0) {
        setErrores(err.campos);
      } else if (err.status === 409) {
        setResultado({ rechazo: err });
        onRegistrada();
      } else {
        setResultado({ error: err });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-body">
        <h2 className="h5 mb-0">Registrar venta</h2>
      </Card.Header>
      <Card.Body>
        <Form noValidate onSubmit={enviar}>
          <Form.Group className="mb-3" controlId="venta-bebida">
            <Form.Label>Bebida</Form.Label>
            <Form.Select
              value={seleccion}
              onChange={(e) => {
                setBebidaId(e.target.value);
                setErrores((prev) => ({ ...prev, bebidaId: undefined }));
              }}
              isInvalid={Boolean(errores.bebidaId)}
            >
              <option value="">Elige una bebida</option>
              {bebidas.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre} ({nombreTipo(b.tipo).toLowerCase()}), {formatearPesos(b.precio)}, stock {b.stock}
                  {b.ventaRestringida ? ", restringida" : ""}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.bebidaId}</Form.Control.Feedback>
            {!errores.bebidaId && <Form.Text>La lista sigue el filtro del catálogo.</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="venta-unidades">
            <Form.Label>Unidades</Form.Label>
            <Form.Control
              type="number"
              inputMode="numeric"
              min={1}
              value={unidades}
              onChange={(e) => {
                setUnidades(e.target.value);
                setErrores((prev) => ({ ...prev, unidades: undefined }));
              }}
              isInvalid={Boolean(errores.unidades)}
            />
            <Form.Control.Feedback type="invalid">{errores.unidades}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
            Registrar venta
          </Button>
        </Form>

        {resultado?.venta && (
          <Alert variant="success" className="mt-3 mb-0">
            <strong className="d-block">Venta autorizada</strong>
            {resultado.venta.unidades} × {resultado.venta.nombre}. Total cobrado:{" "}
            <strong>{formatearPesos(resultado.venta.total)}</strong>
          </Alert>
        )}

        {resultado?.rechazo && (
          <Alert variant="warning" className="mt-3 mb-0">
            <strong className="d-block">Venta rechazada: {nombreMotivo(resultado.rechazo.codigo).toLowerCase()}</strong>
            {resultado.rechazo.message}
          </Alert>
        )}

        {resultado?.error && (
          <div className="mt-3">
            <AlertaError error={resultado.error} titulo="No se pudo registrar la venta" />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

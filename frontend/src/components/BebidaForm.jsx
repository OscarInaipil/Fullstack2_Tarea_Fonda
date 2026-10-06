import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import AlertaError from "./AlertaError.jsx";
import { actualizarBebida, crearBebida } from "../services/api.js";

const VACIO = {
  nombre: "",
  tipo: "ALCOHOLICA",
  volumenML: "",
  stock: "",
  gradosAlcohol: "",
  certificada: false,
  azucarPorLitro: "",
  ventaRestringida: false,
};

function desdeBebida(b) {
  return {
    nombre: b.nombre,
    tipo: b.tipo,
    volumenML: String(b.volumenML),
    stock: String(b.stock),
    gradosAlcohol: b.gradosAlcohol ?? "",
    certificada: Boolean(b.certificada),
    azucarPorLitro: b.azucarPorLitro ?? "",
    ventaRestringida: b.ventaRestringida,
  };
}

const aNumero = (valor) => (valor === "" || valor == null ? null : Number(valor));
function aPeticion(datos) {
  const alcoholica = datos.tipo === "ALCOHOLICA";
  return {
    nombre: datos.nombre,
    tipo: datos.tipo,
    volumenML: aNumero(datos.volumenML),
    stock: aNumero(datos.stock),
    gradosAlcohol: alcoholica ? aNumero(datos.gradosAlcohol) : null,
    certificada: alcoholica ? datos.certificada : null,
    azucarPorLitro: alcoholica ? null : aNumero(datos.azucarPorLitro),
    ventaRestringida: datos.ventaRestringida,
  };
}

export default function BebidaForm({ bebida, onGuardada, onCancelar }) {
  const editando = Boolean(bebida);
  const [datos, setDatos] = useState(() => (bebida ? desdeBebida(bebida) : VACIO));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const tarjeta = useRef(null);
  useEffect(() => {
    if (!editando) return;
    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    tarjeta.current?.scrollIntoView({ behavior: sinAnimacion ? "auto" : "smooth", block: "start" });
  }, [editando]);

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setDatos((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErrores({});
    setErrorGeneral(null);
    try {
      const guardada = editando
        ? await actualizarBebida(bebida.id, aPeticion(datos))
        : await crearBebida(aPeticion(datos));
      if (!editando) setDatos(VACIO);
      onGuardada(guardada, editando);
    } catch (err) {
      if (err.status === 400 && Object.keys(err.campos).length > 0) {
        setErrores(err.campos);
      } else {
        setErrorGeneral(err);
      }
    } finally {
      setEnviando(false);
    }
  }

  const alcoholica = datos.tipo === "ALCOHOLICA";
  const hayErroresDeCampo = Object.values(errores).some(Boolean);

  return (
    <Card ref={tarjeta} className={`shadow-sm ${editando ? "border-primary" : ""}`}>
      <Card.Header className="bg-body">
        <h2 className="h5 mb-0">{editando ? `Editar ${bebida.nombre}` : "Nueva bebida"}</h2>
      </Card.Header>
      <Card.Body>
        {errorGeneral && <AlertaError error={errorGeneral} titulo="No se pudo guardar la bebida" />}
        <Form noValidate onSubmit={enviar}>
          <Form.Group className="mb-3" controlId="bebida-nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={Boolean(errores.nombre)} maxLength={80} />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="bebida-tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Select name="tipo" value={datos.tipo} onChange={cambiar} isInvalid={Boolean(errores.tipo)}>
              <option value="ALCOHOLICA">Alcohólica</option>
              <option value="SIN_ALCOHOL">Sin alcohol</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.tipo}</Form.Control.Feedback>
          </Form.Group>

          <Row className="g-3 mb-3">
            <Col xs={6}>
              <Form.Group controlId="bebida-volumen">
                <Form.Label>Volumen (ml)</Form.Label>
                <Form.Control type="number" inputMode="numeric" name="volumenML" value={datos.volumenML} onChange={cambiar} isInvalid={Boolean(errores.volumenML)} min={100} max={3000} />
                <Form.Control.Feedback type="invalid">{errores.volumenML}</Form.Control.Feedback>
                {!errores.volumenML && <Form.Text>Entre 100 y 3000</Form.Text>}
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="bebida-stock">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" inputMode="numeric" name="stock" value={datos.stock} onChange={cambiar} isInvalid={Boolean(errores.stock)} min={0} />
                <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {alcoholica ? (
            <Row className="g-3 mb-3 align-items-end">
              <Col xs={6}>
                <Form.Group controlId="bebida-grados">
                  <Form.Label>Grados de alcohol</Form.Label>
                  <Form.Control type="number" inputMode="decimal" step="0.1" name="gradosAlcohol" value={datos.gradosAlcohol} onChange={cambiar} isInvalid={Boolean(errores.gradosAlcohol)} min={0.5} max={45} />
                  <Form.Control.Feedback type="invalid">{errores.gradosAlcohol}</Form.Control.Feedback>
                  {!errores.gradosAlcohol && <Form.Text>Entre 0,5 y 45</Form.Text>}
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Check id="bebida-certificada" name="certificada" label="Certificada por el proveedor" checked={datos.certificada} onChange={cambiar} className="mb-4" />
              </Col>
            </Row>
          ) : (
            <Form.Group className="mb-3" controlId="bebida-azucar">
              <Form.Label>Azúcar (g/L)</Form.Label>
              <Form.Control type="number" inputMode="numeric" name="azucarPorLitro" value={datos.azucarPorLitro} onChange={cambiar} isInvalid={Boolean(errores.azucarPorLitro)} min={0} />
              <Form.Control.Feedback type="invalid">{errores.azucarPorLitro}</Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Check id="bebida-restringida" name="ventaRestringida" label="Venta restringida" checked={datos.ventaRestringida} onChange={cambiar} className="mb-3" />

          {hayErroresDeCampo && (
            <Alert variant="danger" className="py-2 small">Revisa los campos marcados en rojo.</Alert>
          )}

          <div className="d-flex flex-wrap gap-2">
            <Button type="submit" variant="primary" disabled={enviando}>
              {enviando && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
              {editando ? "Guardar cambios" : "Agregar bebida"}
            </Button>
            {editando && (
              <Button variant="outline-secondary" onClick={onCancelar} disabled={enviando}>
                Cancelar edición
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
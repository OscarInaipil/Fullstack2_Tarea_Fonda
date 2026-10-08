import { Badge, Button, Card, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import AlertaError from "./AlertaError.jsx";
import { formatearPesos, nombreTipo } from "../utils/formato.js";


export default function BebidaList({
  bebidas,
  cargando,
  error,
  filtro,
  onFiltroChange,
  onReintentar,
  onEditar,
  onEliminar,
  onRestringir,
  procesandoId,
}) {
  const sinResultados = !cargando && !error && bebidas.length === 0;

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-body d-flex align-items-center justify-content-between gap-2">
        <h2 className="h5 mb-0">Catálogo de bebidas</h2>
        {cargando && (
          <span className="d-inline-flex align-items-center gap-2 small text-body-secondary" role="status">
            <Spinner animation="border" size="sm" aria-hidden="true" />
            Cargando…
          </span>
        )}
      </Card.Header>

      <Card.Body>
        <Form role="search" className="mb-3" onSubmit={(e) => e.preventDefault()}>
          <Form.Label htmlFor="filtro-nombre" className="visually-hidden">
            Buscar por nombre
          </Form.Label>
          <InputGroup>
            <Form.Control
              id="filtro-nombre"
              type="search"
              placeholder="Buscar por nombre, por ejemplo chicha"
              value={filtro}
              onChange={(e) => onFiltroChange(e.target.value)}
            />
            {filtro && (
              <Button variant="outline-secondary" onClick={() => onFiltroChange("")}>
                Limpiar
              </Button>
            )}
          </InputGroup>
        </Form>

        {error && <AlertaError error={error} titulo="No se pudo cargar el catálogo" onReintentar={onReintentar} />}

        {sinResultados && (
          <p className="text-body-secondary mb-0">
            {filtro
              ? `Ninguna bebida coincide con “${filtro}”.`
              : "El catálogo está vacío. Agrega la primera bebida con el formulario."}
          </p>
        )}

        {bebidas.length > 0 && (
          <Table hover className="tabla-apilable align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Tipo</th>
                <th scope="col" className="text-end">Volumen</th>
                <th scope="col" className="text-end">Stock</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col">Venta</th>
                <th scope="col" className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bebidas.map((b) => {
                const ocupada = procesandoId === b.id;
                return (
                  <tr key={b.id}>
                    <td data-label="Nombre" className="fw-semibold">{b.nombre}</td>
                    <td data-label="Tipo">
                      <div className="d-flex flex-column align-items-end align-items-md-start">
                        <Badge bg={b.tipo === "ALCOHOLICA" ? "primary" : "secondary"}>{nombreTipo(b.tipo)}</Badge>
                        <small className="text-body-secondary">
                          {b.tipo === "ALCOHOLICA"
                            ? `${b.gradosAlcohol}°, ${b.certificada ? "certificada" : "sin certificación"}`
                            : `${b.azucarPorLitro} g/L de azúcar`}
                        </small>
                      </div>
                    </td>
                    <td data-label="Volumen" className="text-end text-nowrap">{b.volumenML.toLocaleString("es-CL")} ml</td>
                    <td data-label="Stock" className="text-end">
                      {b.stock === 0 ? <Badge bg="warning" text="dark">Agotada</Badge> : b.stock}
                    </td>
                    <td data-label="Precio" className="text-end fw-semibold text-nowrap">{formatearPesos(b.precio)}</td>
                    <td data-label="Venta">
                      {b.ventaRestringida ? (
                        <Badge bg="danger">Restringida</Badge>
                      ) : (
                        <Button size="sm" variant="outline-danger" disabled={ocupada} onClick={() => onRestringir(b)}>
                          Restringir
                        </Button>
                      )}
                    </td>
                    <td data-label="Acciones" className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button size="sm" variant="outline-primary" disabled={ocupada} onClick={() => onEditar(b)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="outline-secondary" disabled={ocupada} onClick={() => onEliminar(b)}>
                          {ocupada ? <Spinner animation="border" size="sm" aria-label="Procesando" /> : "Eliminar"}
                        </Button>
                      </div>
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
import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Aviso from "./components/Aviso.jsx";
import BebidaForm from "./components/BebidaForm.jsx";
import BebidaList from "./components/BebidaList.jsx";
import Encabezado from "./components/Encabezado.jsx";
import VentaForm from "./components/VentaForm.jsx";
import VentaHistorial from "./components/VentaHistorial.jsx";
import { eliminarBebida, listarBebidas, listarVentas, restringirVenta } from "./services/api.js";

export default function App() {
  const [bebidas, setBebidas] = useState([]);
  const [cargandoBebidas, setCargandoBebidas] = useState(true);
  const [errorBebidas, setErrorBebidas] = useState(null);
  const [filtro, setFiltro] = useState("");

  const [ventas, setVentas] = useState([]);
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [errorVentas, setErrorVentas] = useState(null);

  const [bebidaEnEdicion, setBebidaEnEdicion] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [aviso, setAviso] = useState(null);

  const ultimaPeticion = useRef(0);

  const cargarBebidas = useCallback(async (nombre) => {
    const numero = ++ultimaPeticion.current;
    setCargandoBebidas(true);
    try {
      const datos = await listarBebidas(nombre);
      if (numero !== ultimaPeticion.current) return;
      setBebidas(datos);
      setErrorBebidas(null);
    } catch (err) {
      if (numero === ultimaPeticion.current) setErrorBebidas(err);
    } finally {
      if (numero === ultimaPeticion.current) setCargandoBebidas(false);
    }
  }, []);

  const cargarVentas = useCallback(async () => {
    setCargandoVentas(true);
    try {
      setVentas(await listarVentas());
      setErrorVentas(null);
    } catch (err) {
      setErrorVentas(err);
    } finally {
      setCargandoVentas(false);
    }
  }, []);

  useEffect(() => {
    const espera = setTimeout(() => cargarBebidas(filtro), 300);
    return () => clearTimeout(espera);
  }, [filtro, cargarBebidas]);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  const mostrarAviso = (tipo, texto) => setAviso({ id: Date.now(), tipo, texto });

  function bebidaGuardada(bebida, eraEdicion) {
    mostrarAviso("success", eraEdicion ? `${bebida.nombre} actualizada.` : `${bebida.nombre} agregada al catálogo.`);
    setBebidaEnEdicion(null);
    cargarBebidas(filtro);
  }

  async function eliminar(bebida) {
    if (!window.confirm(`¿Eliminar ${bebida.nombre} del catálogo?`)) return;
    setProcesandoId(bebida.id);
    try {
      await eliminarBebida(bebida.id);
      if (bebidaEnEdicion?.id === bebida.id) setBebidaEnEdicion(null);
      mostrarAviso("success", `${bebida.nombre} eliminada del catálogo.`);
      await cargarBebidas(filtro);
    } catch (err) {
      mostrarAviso("danger", err.message);
    } finally {
      setProcesandoId(null);
    }
  }

  async function restringir(bebida) {
    setProcesandoId(bebida.id);
    try {
      await restringirVenta(bebida.id);
      mostrarAviso("success", `La venta de ${bebida.nombre} quedó restringida.`);
      await cargarBebidas(filtro);
    } catch (err) {
      mostrarAviso("danger", err.message);
    } finally {
      setProcesandoId(null);
    }
  }

  function ventaRegistrada() {
    cargarBebidas(filtro);
    cargarVentas();
  }

  return (
    <>
      <Encabezado />

      <Container as="main" className="pb-5">
        <Row className="g-4">
          <Col xs={12}>
            <BebidaList
              bebidas={bebidas}
              cargando={cargandoBebidas}
              error={errorBebidas}
              filtro={filtro}
              onFiltroChange={setFiltro}
              onReintentar={() => cargarBebidas(filtro)}
              onEditar={setBebidaEnEdicion}
              onEliminar={eliminar}
              onRestringir={restringir}
              procesandoId={procesandoId}
            />
          </Col>

          <Col lg={6}>
            <VentaForm bebidas={bebidas} onRegistrada={ventaRegistrada} />
          </Col>

          <Col lg={6}>
            <BebidaForm
              key={bebidaEnEdicion?.id ?? "nueva"}
              bebida={bebidaEnEdicion}
              onGuardada={bebidaGuardada}
              onCancelar={() => setBebidaEnEdicion(null)}
            />
          </Col>

          <Col xs={12}>
            <VentaHistorial
              ventas={ventas}
              cargando={cargandoVentas}
              error={errorVentas}
              onActualizar={cargarVentas}
            />
          </Col>
        </Row>
      </Container>

      <Aviso aviso={aviso} onCerrar={() => setAviso(null)} />
    </>
  );
}

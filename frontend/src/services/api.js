const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";


export class ApiError extends Error {
  constructor({ status, codigo, mensaje, campos }) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.codigo = codigo;
    this.campos = campos ?? {};
  }
}

const MENSAJES_POR_ESTADO = {
  400: "La petición tiene datos inválidos.",
  404: "El recurso no existe.",
  409: "La operación no se pudo completar.",
  500: "El servidor tuvo un error inesperado.",
};


async function pedir(ruta, opciones = {}) {
  let res;
  try {
    res = await fetch(`${API}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new ApiError({
      status: 0,
      codigo: "SIN_CONEXION",
      mensaje: `No se pudo conectar con el servidor (${API}). Revisa que el backend esté corriendo.`,
    });
  }

  if (!res.ok) {
    let cuerpo = null;
    try {
      cuerpo = await res.json();
    } catch {
    }
    throw new ApiError({
      status: res.status,
      codigo: cuerpo?.error ?? `HTTP_${res.status}`,
      mensaje: cuerpo?.mensaje ?? MENSAJES_POR_ESTADO[res.status] ?? `Error HTTP ${res.status}.`,
      campos: cuerpo?.campos,
    });
  }

  return res.status === 204 ? null : res.json();
}

export function listarBebidas(nombre) {

  const texto = nombre?.trim();
  const query = texto ? `?${new URLSearchParams({ nombre: texto })}` : "";
  return pedir(`/bebidas${query}`);
}

export function crearBebida(datos) {
  return pedir("/bebidas", { method: "POST", body: JSON.stringify(datos) });
}

export function actualizarBebida(id, datos) {
  return pedir(`/bebidas/${id}`, { method: "PUT", body: JSON.stringify(datos) });
}

export function eliminarBebida(id) {
  return pedir(`/bebidas/${id}`, { method: "DELETE" });
}

export function restringirVenta(id) {
  return pedir(`/bebidas/${id}/restriccion`, { method: "PATCH" });
}

export function registrarVenta(bebidaId, unidades) {
  return pedir("/ventas", { method: "POST", body: JSON.stringify({ bebidaId, unidades }) });
}

export function listarVentas() {
  return pedir("/ventas");
}

const pesos = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const fechaHora = new Intl.DateTimeFormat("es-CL", { dateStyle: "short", timeStyle: "short" });

export const formatearPesos = (valor) => (valor == null ? "—" : pesos.format(valor));

export const formatearFecha = (iso) => (iso ? fechaHora.format(new Date(iso)) : "—");

export const nombreTipo = (tipo) => (tipo === "ALCOHOLICA" ? "Alcohólica" : "Sin alcohol");

const MOTIVOS = {
  VENTA_RESTRINGIDA: "Venta restringida",
  LIMITE_EXCEDIDO: "Límite por cliente excedido",
  STOCK_INSUFICIENTE: "Stock insuficiente",
};

export const nombreMotivo = (codigo) => MOTIVOS[codigo] ?? codigo;
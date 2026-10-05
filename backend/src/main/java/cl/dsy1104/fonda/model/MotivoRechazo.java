package cl.dsy1104.fonda.model;

/** Motivos por los que el servicio rechaza una venta, en el orden en que se verifican. */
public enum MotivoRechazo {
    VENTA_RESTRINGIDA,
    LIMITE_EXCEDIDO,
    STOCK_INSUFICIENTE
}

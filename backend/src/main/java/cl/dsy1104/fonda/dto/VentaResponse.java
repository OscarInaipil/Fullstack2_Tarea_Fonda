package cl.dsy1104.fonda.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import cl.dsy1104.fonda.model.EstadoVenta;
import cl.dsy1104.fonda.model.MotivoRechazo;
import cl.dsy1104.fonda.model.Venta;

/** Lo que la API devuelve de una venta, autorizada o rechazada. */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record VentaResponse(
        Long id,
        Long bebidaId,
        String nombre,
        Integer unidades,
        Integer total,
        EstadoVenta estado,
        MotivoRechazo motivo,
        String detalle,
        LocalDateTime fecha
) {

    public static VentaResponse desde(Venta venta) {
        return new VentaResponse(
                venta.getId(),
                venta.getBebida().getId(),
                venta.getBebida().getNombre(),
                venta.getUnidades(),
                venta.getTotal(),
                venta.getEstado(),
                venta.getMotivoRechazo(),
                venta.getDetalleRechazo(),
                venta.getFecha());
    }
}
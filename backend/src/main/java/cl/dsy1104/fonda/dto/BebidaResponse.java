package cl.dsy1104.fonda.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import cl.dsy1104.fonda.model.Bebida;
import cl.dsy1104.fonda.model.TipoBebida;


@JsonInclude(JsonInclude.Include.NON_NULL)
public record BebidaResponse(
        Long id,
        String nombre,
        TipoBebida tipo,
        Integer volumenML,
        Integer stock,
        Double gradosAlcohol,
        Boolean certificada,
        Integer azucarPorLitro,
        boolean ventaRestringida,
        int precio
) {

    public static BebidaResponse desde(Bebida bebida, int precio) {
        return new BebidaResponse(
                bebida.getId(),
                bebida.getNombre(),
                bebida.getTipo(),
                bebida.getVolumenML(),
                bebida.getStock(),
                bebida.getGradosAlcohol(),
                bebida.getCertificada(),
                bebida.getAzucarPorLitro(),
                bebida.isVentaRestringida(),
                precio);
    }
}
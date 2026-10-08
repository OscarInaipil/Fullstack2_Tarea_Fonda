package cl.dsy1104.fonda.dto;

import cl.dsy1104.fonda.model.TipoBebida;
import cl.dsy1104.fonda.validation.BebidaConsistente;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@BebidaConsistente
public record BebidaRequest(

        @NotBlank(message = "no puede estar vacío")
        @Size(max = 80, message = "no puede superar los 80 caracteres")
        String nombre,

        @NotNull(message = "es obligatorio: ALCOHOLICA o SIN_ALCOHOL")
        TipoBebida tipo,

        @NotNull(message = "es obligatorio")
        @Min(value = 100, message = "debe estar entre 100 y 3000")
        @Max(value = 3000, message = "debe estar entre 100 y 3000")
        Integer volumenML,

        @NotNull(message = "es obligatorio")
        @PositiveOrZero(message = "debe ser mayor o igual a cero")
        Integer stock,

        // Un valor nulo pasa estas dos reglas
        @DecimalMin(value = "0.5", message = "debe estar entre 0,5 y 45")
        @DecimalMax(value = "45", message = "debe estar entre 0,5 y 45")
        Double gradosAlcohol,

        Boolean certificada,

        @PositiveOrZero(message = "debe ser mayor o igual a cero")
        Integer azucarPorLitro,

        Boolean ventaRestringida
) {
}
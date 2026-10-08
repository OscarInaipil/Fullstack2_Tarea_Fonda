package cl.dsy1104.fonda.validation;

import cl.dsy1104.fonda.dto.BebidaRequest;
import cl.dsy1104.fonda.model.TipoBebida;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;


public class BebidaConsistenteValidator implements ConstraintValidator<BebidaConsistente, BebidaRequest> {

    @Override
    public boolean isValid(BebidaRequest bebida, ConstraintValidatorContext contexto) {
        if (bebida == null || bebida.tipo() == null) {
            return true;
        }

        contexto.disableDefaultConstraintViolation();
        boolean valido = true;

        if (bebida.tipo() == TipoBebida.ALCOHOLICA) {
            if (bebida.gradosAlcohol() == null) {
                valido = rechazar(contexto, "gradosAlcohol", "es obligatorio cuando el tipo es ALCOHOLICA");
            }
            if (bebida.azucarPorLitro() != null) {
                valido = rechazar(contexto, "azucarPorLitro", "debe quedar vacío cuando el tipo es ALCOHOLICA");
            }
        } else {
            if (bebida.azucarPorLitro() == null) {
                valido = rechazar(contexto, "azucarPorLitro", "es obligatorio cuando el tipo es SIN_ALCOHOL");
            }
            if (bebida.gradosAlcohol() != null) {
                valido = rechazar(contexto, "gradosAlcohol", "debe quedar vacío cuando el tipo es SIN_ALCOHOL");
            }
        }
        return valido;
    }

    private boolean rechazar(ConstraintValidatorContext contexto, String campo, String mensaje) {
        contexto.buildConstraintViolationWithTemplate(mensaje)
                .addPropertyNode(campo)
                .addConstraintViolation();
        return false;
    }
}
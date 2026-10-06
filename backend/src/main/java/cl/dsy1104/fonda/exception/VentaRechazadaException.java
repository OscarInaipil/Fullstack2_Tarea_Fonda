package cl.dsy1104.fonda.exception;

import cl.dsy1104.fonda.model.MotivoRechazo;

public class VentaRechazadaException extends ConflictoException {

    public VentaRechazadaException(MotivoRechazo motivo, String mensaje) {
        super(motivo.name(), mensaje);
    }
}

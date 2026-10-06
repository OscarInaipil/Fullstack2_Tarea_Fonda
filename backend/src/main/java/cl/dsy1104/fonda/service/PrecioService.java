package cl.dsy1104.fonda.service;

import org.springframework.stereotype.Service;
import cl.dsy1104.fonda.model.Bebida;

@Service
public class PrecioService {
    private static final int BASE_ALCOHOLICA = 3500;
    private static final int RECARGO_SIN_CERTIFICACION = 20; // %
    private static final int BASE_SIN_ALCOHOL = 2000;
    private static final int RECARGO_AZUCAR = 10; // %
    private static final int UMBRAL_AZUCAR = 80; // g/L
        public int calcular(Bebida bebida) {
        return switch (bebida.getTipo()) {
            case ALCOHOLICA -> Boolean.TRUE.equals(bebida.getCertificada())
                    ? BASE_ALCOHOLICA
                    : conRecargo(BASE_ALCOHOLICA, RECARGO_SIN_CERTIFICACION);
            case SIN_ALCOHOL -> bebida.getAzucarPorLitro() != null && bebida.getAzucarPorLitro() > UMBRAL_AZUCAR
                    ? conRecargo(BASE_SIN_ALCOHOL, RECARGO_AZUCAR)
                    : BASE_SIN_ALCOHOL;
        };
    }
    private int conRecargo(int base, int porcentaje) {
        return base * (100 + porcentaje) / 100;
    }
}
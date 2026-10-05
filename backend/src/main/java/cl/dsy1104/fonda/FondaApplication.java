package cl.dsy1104.fonda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada de la aplicacion.
 *
 * Revisa el enunciado en README.md. Debes crear, en subpaquetes de este
 * mismo paquete, las clases de cada capa:
 *
 *   model/       Bebida, Venta, TipoBebida, EstadoVenta
 *   repository/  BebidaRepository, VentaRepository
 *   service/     BebidaService, VentaService
 *   controller/  BebidaController, VentaController
 *   dto/         objetos de entrada y de salida
 *   exception/   manejador global de errores
 */
@SpringBootApplication
public class FondaApplication {

    public static void main(String[] args) {
        SpringApplication.run(FondaApplication.class, args);
    }
}

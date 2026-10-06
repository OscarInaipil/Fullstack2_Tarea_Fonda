package cl.dsy1104.fonda.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.dsy1104.fonda.dto.VentaRequest;
import cl.dsy1104.fonda.dto.VentaResponse;
import cl.dsy1104.fonda.exception.RecursoNoEncontradoException;
import cl.dsy1104.fonda.exception.VentaRechazadaException;
import cl.dsy1104.fonda.model.Bebida;
import cl.dsy1104.fonda.model.MotivoRechazo;
import cl.dsy1104.fonda.model.TipoBebida;
import cl.dsy1104.fonda.model.Venta;
import cl.dsy1104.fonda.repository.BebidaRepository;
import cl.dsy1104.fonda.repository.VentaRepository;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final BebidaRepository bebidaRepository;
    private final PrecioService precioService;
    private final int limiteUnidadesPorCliente;

    public VentaService(VentaRepository ventaRepository, BebidaRepository bebidaRepository,
                        PrecioService precioService,
                        @Value("${fonda.limite-unidades-por-cliente}") int limiteUnidadesPorCliente) {
        this.ventaRepository = ventaRepository;
        this.bebidaRepository = bebidaRepository;
        this.precioService = precioService;
        this.limiteUnidadesPorCliente = limiteUnidadesPorCliente;
    }

    @Transactional(noRollbackFor = VentaRechazadaException.class)
    public VentaResponse registrar(VentaRequest pedido) {
        Bebida bebida = bebidaRepository.findById(pedido.bebidaId())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe una bebida con id " + pedido.bebidaId() + "."));
        int unidades = pedido.unidades();

        if (bebida.isVentaRestringida()) {
            throw rechazar(bebida, unidades, MotivoRechazo.VENTA_RESTRINGIDA,
                    "La venta de " + bebida.getNombre() + " está restringida.");
        }

        if (bebida.getTipo() == TipoBebida.ALCOHOLICA && unidades > limiteUnidadesPorCliente) {
            throw rechazar(bebida, unidades, MotivoRechazo.LIMITE_EXCEDIDO,
                    unidades + " unidades superan el límite de " + limiteUnidadesPorCliente + " por cliente.");
        }

        if (bebida.getStock() < unidades) {
            throw rechazar(bebida, unidades, MotivoRechazo.STOCK_INSUFICIENTE,
                    "Se pidieron " + unidades + " unidades y quedan " + bebida.getStock() + ".");
        }
        bebida.setStock(bebida.getStock() - unidades);
        bebidaRepository.save(bebida);

        int total = precioService.calcular(bebida) * unidades;
        Venta venta = ventaRepository.save(Venta.autorizada(bebida, unidades, total));
        return VentaResponse.desde(venta);
    }

    @Transactional(readOnly = true)
    public List<VentaResponse> historial() {
        return ventaRepository.findAllByOrderByIdDesc().stream()
                .map(VentaResponse::desde)
                .toList();
    }
    @Transactional(readOnly = true)
    public VentaResponse obtener(Long id) {
        return ventaRepository.findById(id)
                .map(VentaResponse::desde)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una venta con id " + id + "."));
    }
    private VentaRechazadaException rechazar(Bebida bebida, int unidades, MotivoRechazo motivo, String detalle) {
        ventaRepository.save(Venta.rechazada(bebida, unidades, motivo, detalle));
        return new VentaRechazadaException(motivo, detalle);
    }
}
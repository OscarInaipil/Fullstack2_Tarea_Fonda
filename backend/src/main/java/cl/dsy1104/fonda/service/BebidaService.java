package cl.dsy1104.fonda.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cl.dsy1104.fonda.dto.BebidaRequest;
import cl.dsy1104.fonda.dto.BebidaResponse;
import cl.dsy1104.fonda.exception.ConflictoException;
import cl.dsy1104.fonda.exception.RecursoNoEncontradoException;
import cl.dsy1104.fonda.model.Bebida;
import cl.dsy1104.fonda.model.TipoBebida;
import cl.dsy1104.fonda.repository.BebidaRepository;
import cl.dsy1104.fonda.repository.VentaRepository;

@Service
public class BebidaService {

    private final BebidaRepository bebidaRepository;
    private final VentaRepository ventaRepository;
    private final PrecioService precioService;

    public BebidaService(BebidaRepository bebidaRepository, VentaRepository ventaRepository,
                         PrecioService precioService) {
        this.bebidaRepository = bebidaRepository;
        this.ventaRepository = ventaRepository;
        this.precioService = precioService;
    }
    @Transactional(readOnly = true)
    public List<BebidaResponse> listar(String nombre) {
        List<Bebida> bebidas = (nombre == null || nombre.isBlank())
                ? bebidaRepository.findAllByOrderByIdAsc()
                : bebidaRepository.findByNombreContainingIgnoreCaseOrderByIdAsc(nombre.trim());
        return bebidas.stream().map(this::aRespuesta).toList();
    }

    @Transactional(readOnly = true)
    public BebidaResponse obtener(Long id) {
        return aRespuesta(buscar(id));
    }
    @Transactional
    public BebidaResponse crear(BebidaRequest datos) {
        Bebida bebida = new Bebida();
        bebida.setVentaRestringida(Boolean.TRUE.equals(datos.ventaRestringida()));
        copiarDatos(datos, bebida);
        return aRespuesta(bebidaRepository.save(bebida));
    }
    @Transactional
    public BebidaResponse actualizar(Long id, BebidaRequest datos) {
        Bebida bebida = buscar(id);
        if (datos.ventaRestringida() != null) {
            bebida.setVentaRestringida(datos.ventaRestringida());
        }
        copiarDatos(datos, bebida);
        return aRespuesta(bebidaRepository.save(bebida));
    }
    @Transactional
    public void eliminar(Long id) {
        Bebida bebida = buscar(id);
        if (ventaRepository.existsByBebidaId(id)) {
            throw new ConflictoException("BEBIDA_CON_VENTAS",
                    "No se puede eliminar " + bebida.getNombre() + " porque tiene ventas en el historial.");
        }
        bebidaRepository.delete(bebida);
    }

    @Transactional
    public BebidaResponse restringir(Long id) {
        Bebida bebida = buscar(id);
        bebida.setVentaRestringida(true);
        return aRespuesta(bebidaRepository.save(bebida));
    }

    private Bebida buscar(Long id) {
        return bebidaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe una bebida con id " + id + "."));
    }
    private void copiarDatos(BebidaRequest datos, Bebida bebida) {
        bebida.setNombre(datos.nombre().trim());
        bebida.setTipo(datos.tipo());
        bebida.setVolumenML(datos.volumenML());
        bebida.setStock(datos.stock());
        if (datos.tipo() == TipoBebida.ALCOHOLICA) {
            bebida.setGradosAlcohol(datos.gradosAlcohol());
            bebida.setCertificada(Boolean.TRUE.equals(datos.certificada()));
            bebida.setAzucarPorLitro(null);
        }   else {
             bebida.setAzucarPorLitro(datos.azucarPorLitro());
                bebida.setGradosAlcohol(null);
                bebida.setCertificada(null);
        }
    }
    private BebidaResponse aRespuesta(Bebida bebida) {
        return BebidaResponse.desde(bebida, precioService.calcular(bebida));
    }
}
package cl.dsy1104.fonda.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import cl.dsy1104.fonda.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findAllByOrderByIdDesc();
    boolean existsByBebidaId(Long bebidaId);
}
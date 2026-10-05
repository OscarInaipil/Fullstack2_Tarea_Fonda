package cl.dsy1104.fonda.model;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bebida_id", nullable = false)
    private Bebida bebida;

    @Column(nullable = false)
    private Integer unidades;

    @Column(nullable = false)
    private Integer total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoVenta estado;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private MotivoRechazo motivoRechazo;

    @Column(length = 200)
    private String detalleRechazo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    protected Venta() {
    }

    private Venta(Bebida bebida, int unidades, int total, EstadoVenta estado,
                  MotivoRechazo motivoRechazo, String detalleRechazo) {
        this.bebida = bebida;
        this.unidades = unidades;
        this.total = total;
        this.estado = estado;
        this.motivoRechazo = motivoRechazo;
        this.detalleRechazo = detalleRechazo;
        this.fecha = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }

    public static Venta autorizada(Bebida bebida, int unidades, int total) {
        return new Venta(bebida, unidades, total, EstadoVenta.AUTORIZADA, null, null);
    }

    public static Venta rechazada(Bebida bebida, int unidades, MotivoRechazo motivo, String detalle) {
        return new Venta(bebida, unidades, 0, EstadoVenta.RECHAZADA, motivo, detalle);
    }

    public Long getId() {
        return id;
    }

    public Bebida getBebida() {
        return bebida;
    }

    public Integer getUnidades() {
        return unidades;
    }

    public Integer getTotal() {
        return total;
    }

    public EstadoVenta getEstado() {
        return estado;
    }

    public MotivoRechazo getMotivoRechazo() {
        return motivoRechazo;
    }

    public String getDetalleRechazo() {
        return detalleRechazo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }
}

package cl.dsy1104.fonda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Bebida del catalogo de la fonda.
 *
 * Los atributos propios de cada tipo admiten null:
 *   - gradosAlcohol y certificada solo aplican a ALCOHOLICA.
 *   - azucarPorLitro solo aplica a SIN_ALCOHOL.
 */
@Entity
@Table(name = "bebida")
public class Bebida {

    // IDENTITY: la base genera el id. Asi no choca con las filas que inserta data.sql.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    // STRING guarda "ALCOHOLICA" / "SIN_ALCOHOL" y no la posicion del enum (0, 1).
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoBebida tipo;

    // Sin el nombre explicito, Spring crearia la columna "volumenml" y data.sql usa "volumen_ml".
    @Column(name = "volumen_ml", nullable = false)
    private Integer volumenML;

    @Column(nullable = false)
    private Integer stock;

    private Double gradosAlcohol;

    private Boolean certificada;

    private Integer azucarPorLitro;

    @Column(nullable = false)
    private boolean ventaRestringida;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public TipoBebida getTipo() {
        return tipo;
    }

    public void setTipo(TipoBebida tipo) {
        this.tipo = tipo;
    }

    public Integer getVolumenML() {
        return volumenML;
    }

    public void setVolumenML(Integer volumenML) {
        this.volumenML = volumenML;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getGradosAlcohol() {
        return gradosAlcohol;
    }

    public void setGradosAlcohol(Double gradosAlcohol) {
        this.gradosAlcohol = gradosAlcohol;
    }

    public Boolean getCertificada() {
        return certificada;
    }

    public void setCertificada(Boolean certificada) {
        this.certificada = certificada;
    }

    public Integer getAzucarPorLitro() {
        return azucarPorLitro;
    }

    public void setAzucarPorLitro(Integer azucarPorLitro) {
        this.azucarPorLitro = azucarPorLitro;
    }

    public boolean isVentaRestringida() {
        return ventaRestringida;
    }

    public void setVentaRestringida(boolean ventaRestringida) {
        this.ventaRestringida = ventaRestringida;
    }
}

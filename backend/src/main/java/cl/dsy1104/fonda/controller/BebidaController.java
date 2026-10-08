package cl.dsy1104.fonda.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cl.dsy1104.fonda.dto.BebidaRequest;
import cl.dsy1104.fonda.dto.BebidaResponse;
import cl.dsy1104.fonda.service.BebidaService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/bebidas")
public class BebidaController {

    private final BebidaService bebidaService;

    public BebidaController(BebidaService bebidaService) {
        this.bebidaService = bebidaService;
    }

    @GetMapping
    public ResponseEntity<List<BebidaResponse>> listar(@RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(bebidaService.listar(nombre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BebidaResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(bebidaService.obtener(id));
    }


    @PostMapping
    public ResponseEntity<BebidaResponse> crear(@Valid @RequestBody BebidaRequest datos) {
        BebidaResponse creada = bebidaService.crear(datos);
        return ResponseEntity.created(URI.create("/api/bebidas/" + creada.id())).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BebidaResponse> actualizar(@PathVariable Long id,
                                                     @Valid @RequestBody BebidaRequest datos) {
        return ResponseEntity.ok(bebidaService.actualizar(id, datos));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        bebidaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/restriccion")
    public ResponseEntity<BebidaResponse> restringir(@PathVariable Long id) {
        return ResponseEntity.ok(bebidaService.restringir(id));
    }
}
package com.drones.fct.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.drones.fct.domain.Dron;
import com.drones.fct.repository.DronRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/drones")
public class DronController {

  @Autowired
  private DronRepository dronRepository;

  @PostMapping
  public ResponseEntity<Dron> createDron(@Valid @RequestBody Dron dron) {

    Dron savedDron = dronRepository.save(dron);
    return ResponseEntity.ok(savedDron);
  }

  @GetMapping
  public List<Dron> getAllDrones() {
    return dronRepository.findAll();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Dron> getDron(@PathVariable Long id) {
    Optional<Dron> dron = dronRepository.findById(id);
    return dron.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<Dron> updateDron(@PathVariable Long id, @Valid @RequestBody Dron dronDetails) {
    Optional<Dron> dron = dronRepository.findById(id);
    if (dron.isPresent()) {
      Dron existingDron = dron.get();
      existingDron.setNombre(dronDetails.getNombre());
      existingDron.setModelo(dronDetails.getModelo());
      existingDron.setX(dronDetails.getX());
      existingDron.setY(dronDetails.getY());
      Dron updatedDron = dronRepository.save(existingDron);
      return ResponseEntity.ok(updatedDron);
    }
    return ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteDron(@PathVariable Long id) {
    if (dronRepository.existsById(id)) {
      dronRepository.deleteById(id);
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}

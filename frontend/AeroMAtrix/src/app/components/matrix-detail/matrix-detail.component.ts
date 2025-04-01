import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Matrix } from '../../models/matrix.model';
import { MatrixService } from '../../services/matrix.service';

@Component({
  selector: 'app-matrix-detail',
  templateUrl: './matrix-detail.component.html',
  styleUrls: ['./matrix-detail.component.scss'],
})
export class MatrixDetailComponent implements OnInit {
  matrixId!: number;
  matrix!: Matrix;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private matrixService: MatrixService
  ) {}

  ngOnInit(): void {
    // Extraemos el ID de la matriz desde la URL
    this.matrixId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchMatrix();
  }

  fetchMatrix(): void {
    this.loading = true;
    this.matrixService.getMatrix(this.matrixId).subscribe({
      next: (data) => {
        this.matrix = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la matriz';
        this.loading = false;
      },
    });
  }
}

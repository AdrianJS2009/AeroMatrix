import type { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateMatrixRequest,
  Matrix,
  UpdateMatrixRequest,
} from '../models/matrix.model';

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  private apiUrl = `${environment.apiUrl}/matrices`;

  constructor(private http: HttpClient) {}

  createMatrix(matrix: CreateMatrixRequest): Observable<Matrix> {
    return this.http.post<Matrix>(this.apiUrl, matrix);
  }

  getMatrix(matrixId: number): Observable<Matrix> {
    return this.http.get<Matrix>(`${this.apiUrl}/${matrixId}`);
  }

  updateMatrix(
    matrixId: number,
    matrix: UpdateMatrixRequest
  ): Observable<Matrix> {
    return this.http.put<Matrix>(`${this.apiUrl}/${matrixId}`, matrix);
  }

  deleteMatrix(matrixId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matrixId}`);
  }

  listMatrices(): Observable<Matrix[]> {
    return this.http.get<Matrix[]>(this.apiUrl);
  }
}

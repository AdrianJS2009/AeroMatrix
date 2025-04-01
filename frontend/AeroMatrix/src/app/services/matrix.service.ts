import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateMatrixRequest,
  MatrixModel,
  UpdateMatrixRequest,
} from '../models/matrix.model';

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  private readonly apiUrl = `${environment.apiUrl}/matrices`;

  constructor(private readonly http: HttpClient) {}

  getMatrices(): Observable<MatrixModel[]> {
    return this.http.get<MatrixModel[]>(this.apiUrl);
  }

  getMatrix(id: number): Observable<MatrixModel> {
    return this.http.get<MatrixModel>(`${this.apiUrl}/${id}`);
  }

  createMatrix(matrix: CreateMatrixRequest): Observable<MatrixModel> {
    return this.http.post<MatrixModel>(this.apiUrl, matrix);
  }

  updateMatrix(
    id: number,
    matrix: UpdateMatrixRequest
  ): Observable<MatrixModel> {
    return this.http.put<MatrixModel>(`${this.apiUrl}/${id}`, matrix);
  }

  deleteMatrix(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

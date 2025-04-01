import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type {
  CreateMatrixRequest,
  MatrixModel,
  UpdateMatrixRequest,
} from '../models/matrix.model';
import type { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  private readonly apiUrl = `${environment.apiUrl}/matrices`;

  constructor(private httpClient: HttpClientService) {}

  getMatrices(): Observable<MatrixModel[]> {
    return this.httpClient.get<MatrixModel[]>(this.apiUrl);
  }

  getMatrix(id: number): Observable<MatrixModel> {
    return this.httpClient.get<MatrixModel>(`${this.apiUrl}/${id}`);
  }

  createMatrix(matrix: CreateMatrixRequest): Observable<MatrixModel> {
    return this.httpClient.post<MatrixModel>(this.apiUrl, matrix);
  }

  updateMatrix(
    id: number,
    matrix: UpdateMatrixRequest
  ): Observable<MatrixModel> {
    return this.httpClient.put<MatrixModel>(`${this.apiUrl}/${id}`, matrix);
  }

  deleteMatrix(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}

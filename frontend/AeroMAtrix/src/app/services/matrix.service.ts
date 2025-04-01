import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matrix } from '../models/matrix.model';

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  private apiUrl = '/api/matrices';

  constructor(private http: HttpClient) {}

  createMatrix(matrix: any): Observable<Matrix> {
    return this.http.post<Matrix>(this.apiUrl, matrix);
  }

  getMatrix(matrixId: number): Observable<Matrix> {
    return this.http.get<Matrix>(`${this.apiUrl}/${matrixId}`);
  }

  updateMatrix(matrixId: number, matrix: any): Observable<Matrix> {
    return this.http.put<Matrix>(`${this.apiUrl}/${matrixId}`, matrix);
  }

  deleteMatrix(matrixId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${matrixId}`);
  }

  listMatrices(): Observable<Matrix[]> {
    return this.http.get<Matrix[]>(this.apiUrl);
  }
}

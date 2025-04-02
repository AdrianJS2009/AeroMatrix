import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matrix } from '../models/matrix.model';

@Injectable({ providedIn: 'root' })
export class MatrixService {
  private apiUrl = 'http://localhost:8080/api/matrices';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Matrix[]> {
    return this.http.get<Matrix[]>(this.apiUrl);
  }

  getById(id: number): Observable<Matrix> {
    return this.http.get<Matrix>(`${this.apiUrl}/${id}`);
  }

  create(data: { maxX: number; maxY: number }): Observable<Matrix> {
    return this.http.post<Matrix>(this.apiUrl, data);
  }

  update(id: number, data: { maxX: number; maxY: number }): Observable<Matrix> {
    return this.http.put<Matrix>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

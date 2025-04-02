import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import type { Matrix } from '../models/matrix.model';

@Injectable({ providedIn: 'root' })
export class MatrixService {
  private apiUrl = `${environment.apiUrl}/matrices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Matrix[]> {
    return this.http.get<Matrix[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching matrices:', error);
        return throwError(
          () => new Error('Failed to load matrices. Please try again later.')
        );
      })
    );
  }

  getById(id: number): Observable<Matrix> {
    return this.http.get<Matrix>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching matrix ${id}:`, error);
        return throwError(
          () =>
            new Error('Failed to load matrix details. Please try again later.')
        );
      })
    );
  }

  create(data: { maxX: number; maxY: number }): Observable<Matrix> {
    return this.http.post<Matrix>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating matrix:', error);
        const message =
          error.error?.message ||
          'Failed to create matrix. Please check your input and try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  update(id: number, data: { maxX: number; maxY: number }): Observable<Matrix> {
    return this.http.put<Matrix>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error(`Error updating matrix ${id}:`, error);
        const message =
          error.error?.message ||
          'Failed to update matrix. Please check your input and try again.';
        return throwError(() => new Error(message));
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error deleting matrix ${id}:`, error);
        const message =
          error.error?.message ||
          'Failed to delete matrix. Please try again later.';
        return throwError(() => new Error(message));
      })
    );
  }
}

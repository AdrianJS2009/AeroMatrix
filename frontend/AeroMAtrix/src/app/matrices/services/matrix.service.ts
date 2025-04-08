import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Matrix } from '../models/matrix.model';

export interface CreateMatrixRequest {
  maxX: number;
  maxY: number;
}

export interface UpdateMatrixRequest {
  maxX: number;
  maxY: number;
}

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  private readonly path = '/matrices';

  constructor(private readonly apiService: ApiService) {}

  getAll(): Observable<Matrix[]> {
    return this.apiService.get<Matrix[]>(this.path).pipe(
      catchError((error) => {
        console.error('Error fetching matrices:', error);
        return throwError(
          () => new Error('Failed to load matrices. Please try again later.')
        );
      })
    );
  }

  getById(id: number): Observable<Matrix> {
    return this.apiService.get<Matrix>(`${this.path}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching matrix ${id}:`, error);
        return throwError(
          () =>
            new Error('Failed to load matrix details. Please try again later.')
        );
      })
    );
  }

  create(data: CreateMatrixRequest): Observable<Matrix> {
    return this.apiService
      .post<Matrix, CreateMatrixRequest>(this.path, data)
      .pipe(
        catchError((error) => {
          console.error('Error creating matrix:', error);
          const message =
            error.error?.message ||
            'Failed to create matrix. Please check your input and try again.';
          return throwError(() => new Error(message));
        })
      );
  }

  update(id: number, data: UpdateMatrixRequest): Observable<Matrix> {
    return this.apiService
      .put<Matrix, UpdateMatrixRequest>(`${this.path}/${id}`, data)
      .pipe(
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
    return this.apiService.delete<void>(`${this.path}/${id}`).pipe(
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

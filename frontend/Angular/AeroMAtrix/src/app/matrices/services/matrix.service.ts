import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Matrix } from '../models/matrix.model';

/** Request interface for creating a new matrix */
export interface CreateMatrixRequest {
  maxX: number;
  maxY: number;
}

/** Request interface for updating a matrix */
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
    return this.apiService
      .get<Matrix[]>(this.path)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            'Error fetching matrices:',
            'Failed to load matrices. Please try again later.'
          )
        )
      );
  }

  getById(id: number): Observable<Matrix> {
    return this.apiService
      .get<Matrix>(`${this.path}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `Error fetching matrix ${id}:`,
            'Failed to load matrix details. Please try again later.'
          )
        )
      );
  }

  create(data: CreateMatrixRequest): Observable<Matrix> {
    return this.apiService
      .post<Matrix, CreateMatrixRequest>(this.path, data)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            'Error creating matrix:',
            'Failed to create matrix. Please check your input and try again.'
          )
        )
      );
  }

  update(id: number, data: UpdateMatrixRequest): Observable<Matrix> {
    return this.apiService
      .put<Matrix, UpdateMatrixRequest>(`${this.path}/${id}`, data)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `Error updating matrix ${id}:`,
            'Failed to update matrix. Please check your input and try again.'
          )
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.apiService
      .delete<void>(`${this.path}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(
            error,
            `Error deleting matrix ${id}:`,
            'Failed to delete matrix. Please try again later.'
          )
        )
      );
  }

  private handleError(error: any, consoleMsg: string, defaultMsg: string) {
    console.error(consoleMsg, error);
    const message = error?.error?.message || defaultMsg;
    return throwError(() => new Error(message));
  }
}

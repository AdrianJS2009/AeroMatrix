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

  /**
   * Retrieve all matrices.
   * @returns Observable emitting an array of matrices.
   */
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

  /**
   * Retrieve a matrix by its ID.
   * @param id Matrix identifier.
   * @returns Observable emitting the matrix.
   */
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

  /**
   * Create a new matrix.
   * @param data CreateMatrixRequest containing matrix dimensions.
   * @returns Observable emitting the newly created matrix.
   */
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

  /**
   * Update an existing matrix.
   * @param id Matrix identifier.
   * @param data UpdateMatrixRequest containing the new dimensions.
   * @returns Observable emitting the updated matrix.
   */
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

  /**
   * Delete a matrix by its ID.
   * @param id Matrix identifier.
   * @returns Observable emitting void.
   */
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

  /**
   * Private method to handle API errors.
   * Logs the error and returns an observable error with a user-friendly message.
   *
   * @param error Error object caught from the API call.
   * @param consoleMsg Message to log in the console.
   * @param defaultMsg Default error message for the user.
   * @returns Observable error.
   */
  private handleError(error: any, consoleMsg: string, defaultMsg: string) {
    console.error(consoleMsg, error);
    const message = error?.error?.message || defaultMsg;
    return throwError(() => new Error(message));
  }
}

import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly timeoutDuration = 30000; // Duration in milliseconds

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { params }).pipe(
      timeout(this.timeoutDuration),
      catchError((error) => this.handleError(error, `GET ${path}`))
    );
  }

  post<T, D>(path: string, data: D): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, data).pipe(
      timeout(this.timeoutDuration),
      catchError((error) => this.handleError(error, `POST ${path}`))
    );
  }

  put<T, D>(path: string, data: D): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, data).pipe(
      timeout(this.timeoutDuration),
      catchError((error) => this.handleError(error, `PUT ${path}`))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`).pipe(
      timeout(this.timeoutDuration),
      catchError((error) => this.handleError(error, `DELETE ${path}`))
    );
  }

  // Error handler that logs and transforms HTTP errors into user-friendly messages
  private handleError(
    error: HttpErrorResponse,
    operation: string
  ): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred
      errorMessage = `Network error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else if (
      error.error &&
      typeof error.error === 'object' &&
      'message' in error.error
    ) {
      // Server error with a message
      errorMessage = error.error.message as string;
    } else if (error.status) {
      // Server error without detailed message
      switch (error.status) {
        case 0:
          errorMessage = 'Server is unreachable. Please check your connection.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage =
            'Forbidden. You do not have permission to access this resource.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = 'Conflict with current state of the resource.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Server error: ${error.status}`;
          break;
      }
    }

    // Log the detailed error for debugging purposes
    console.error(`${operation} failed:`, error);

    return throwError(() => new Error(errorMessage));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SealService {
  private apiUrl = 'http://localhost:3000/seal-operation';

  constructor(private http: HttpClient) { }

  performSealOperation(data: { number1: number; number2: number }): Observable<{ result: number }> {
    return this.http.post<{ result: number }>(this.apiUrl, data);
  }
}

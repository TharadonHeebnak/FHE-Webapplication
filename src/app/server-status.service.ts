import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {
  constructor(private http: HttpClient) {}

  checkServer() {
    return this.http.get('http://localhost:3000/ping', { responseType: 'text' })
      .pipe(
        map(() => 'online'),
        catchError(() => of('offline')) // ถ้า error (เช่น server ล่ม) ให้คืนค่า offline
      );
  }
}

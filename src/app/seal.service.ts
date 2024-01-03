import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SealService {
  private apiUrl = 'http://localhost:3000/seal-operation';
  private apiGetSchemeType = 'http://localhost:3000/getSchemeType';
  private apiGetParms = 'http://localhost:3000/createencryptparam'
  private apiGetSecretKey ='http://localhost:3000/creat-secret-key'


  constructor(private http: HttpClient) { }

  performSealOperation(data: { number1: number; number2: number }): Observable<{ result: number }> {
    return this.http.post<{ result: number }>(this.apiUrl, data);
  }

  getSchemeType(): Observable<{ sealOption: any}> {
    return this.http.post<{ sealOption:any }>(this.apiGetSchemeType, {});
  }

  getkey():Observable<{secretBase64Key:any,publicBase64Key:any}>{
    return this.http.post<{secretBase64Key:any,publicBase64Key:any}>(this.apiGetSecretKey,{})
  }



}

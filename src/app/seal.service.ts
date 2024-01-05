import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SealService {

  private apiUrl = 'http://localhost:3000/seal-operation';
  private apiGetSchemeType = 'http://localhost:3000/getSchemeType';
  private apiGetParms = 'http://localhost:3000/createencryptparam';
  private apiGetSecretKey ='http://localhost:3000/creat-secret-key';
  private apiGetpublicKey = 'http://localhost:3000/creat-public-key';
  private apiGetEncryption = 'http://localhost:3000/encryption-file';
  private apiTest = 'http://localhost:3000/file';
  private Url = 'http://localhost:3000/';


  constructor(private http: HttpClient) { }

  performSealOperation(data: { number1: number; number2: number }): Observable<{ result: number }> {
    return this.http.post<{ result: number }>(this.Url+'seal-operation', data);
  }

  getSchemeType(): Observable<{ sealOption: any}> {
    return this.http.get<{ sealOption:any }>(this.Url+'getSchemeType', {});
  }

  getsecretkey(secretKeyName:string):Observable<{secretBase64Key:any,secretKeyName:string}>{
    return this.http.post<{secretBase64Key:any,secretKeyName:string}>(this.Url+'creat-secret-key',{secretKeyName})
  }

  getpublickey(publicKeyName:string,secretKey:any):Observable<{publicBase64Key:any,publicKeyName:string}>{
    return this.http.post<{publicBase64Key:any,publicKeyName:string}>(this.Url+'creat-public-key',{publicKeyName,secretKey})
  }
  getEncryptionFile(fileToEncryption:File,publickey:any){
    console.log('this is publickey in service',publickey)
    return this.http.post<{fileToEncryption:File}>(this.apiTest,{fileToEncryption,publickey})
  }

  getEncryptionFiletest(file:FormData){
    console.log('this is form Data in service',file)
    return this.http.post<{}>(this.apiTest,file)
  }

}

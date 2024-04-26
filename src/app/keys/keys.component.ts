import { Component } from '@angular/core';
import { SealService } from '../seal.service';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
// import {TooltipPosition} from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss'
})
export class KeysComponent {


  constructor(
    private sealService: SealService,
    private service: NotificationsService,
    private http: HttpClient,
    ) {}
  keyName: any;
  secretkey: any;
  publickey: any;
  secretKeyName?: any;
  publicKeyName?: any;
  fileName?:string;
  secretkeyFile: File | null = null;
  selectedSchemeType: string = 'bfv';
  isButtonDisabled = false;
  schemeType: any;
  securityLevel: any;
  selectedSecurityLevel: any;
  secretkeyFileReaded?:string;
  publickeyFileReaded?:string;
  fileToEncryp:File | null = null;
  fileEncrypted:File | null = null;
  
  
    ngOnInit(): void {
    }
  
    positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
    position = new FormControl(this.positionOptions[0]);
  
  securityLevelOption = [
    {securityLevel:'none',value: 'none'},
    {securityLevel:'tc128', value:'128 Bits'},
    {securityLevel:'tc192', value: '192 Bits'},
    {securityLevel:'tc256', value: '256 Bits'},
  ];
  polyModulusDegreeArray = [1024, 2048, 4096, 8192, 16384, 32768];
  polyModulusDegrees: number[] = [1024, 2048, 4096, 8192, 16384, 32768];
  selectedPolyModulusDegree: number = this.polyModulusDegrees[0];
  

  
  createTwoKey(){
    const twoKeyName = (document.getElementById('INPUT-secretkey-pair-name') as HTMLInputElement).value;
    if(twoKeyName !== '' && twoKeyName !== undefined){
      console.log('Key Pair Name:', twoKeyName);
      this.sealService.getTwokey(twoKeyName).subscribe(response =>{
        this.secretkey = response.secretBase64Key;
        this.publickey = response.publicBase64Key;
        this.secretKeyName = response.keyName;
        this.publicKeyName = response.keyName;
        this.keyName = response.keyName;
        console.log('secretKeyName:', this.secretKeyName);
        console.log('publicKeyName:', this.publicKeyName);
        this.service.success('Secret Key are created',this.secretKeyName);
        this.service.success('Public Key are created',this.publicKeyName);
      })
    }else{
      this.service.info('Please Input Name');
    }
  }
  
  
  downloadTxtFile(skey: any,pkey: any,keyname:string) {
    this.saveTxtFiles(skey,pkey,keyname);
    console.log('this key name',keyname);
    
  }

  private saveTxtFiles(data1: any,data2: any, fileName: string, ) {
    // Create Blob for File 1
    const blob1 = new Blob([data1], { type: 'text/plain' });
    const link1 = document.createElement('a');
    link1.href = window.URL.createObjectURL(blob1);
    link1.download = fileName + '_Secretkey.txt' || 'Secretkey.txt';

    // Create Blob for File 2
    const blob2 = new Blob([data2], { type: 'text/plain' });
    const link2 = document.createElement('a');
    link2.href = window.URL.createObjectURL(blob2);
    link2.download = fileName + '_Publickey.txt' || 'Publickey.txt';

    // Append the links to the document body
    document.body.appendChild(link1);
    document.body.appendChild(link2);

    // Trigger the click event for both links
    link1.click();
    link2.click();

    // Remove the links from the document body
    document.body.removeChild(link1);
    document.body.removeChild(link2);
  }

   //////////// downloadfile ///////////  
}

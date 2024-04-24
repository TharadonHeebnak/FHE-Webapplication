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
      this.getSchemeType();
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
  
  getSchemeType() {
    this.sealService.getSchemeType().subscribe(response => {
      console.log(response)
        this.schemeType = response.sealOption.SchemeType;
        this.securityLevel = response.sealOption.SecurityLevel;
        console.log('Received schemeType:', this.schemeType);
        console.log('securityLevel :',this.securityLevel)
      }, error => {
        console.error('Error fetching schemeType:', error);
      });
  }
  
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
  
  getpublickey(){
    const publicKeyName = (document.getElementById('INPUT-public-key') as HTMLInputElement).value;
    if(this.secretkeyFileReaded){
      if(publicKeyName !== '' && publicKeyName !== undefined){
      this.sealService.getpublickey(publicKeyName,this.secretkeyFileReaded).subscribe(response =>{
        this.publickey = response.publicBase64Key;
        this.publicKeyName = response.publicKeyName;
        console.log('publickey are created');
        this.service.success('publickey are created',this.publicKeyName);
      })
      }else{
        this.service.info('Please Input Name');
      }
    }else{
      this.service.info('Please Upload Secret Key')
  
    }
  
  }
  
  downloadTxtFile(skey: any,pkey: any,keyname:string) {
    this.saveTxtFiles(skey,pkey,keyname);
    console.log('this key name',keyname);
    
  }
  
  // private saveTxtFiles(data1: any,data2: any, fileName: string, ) {
  //   // Create Blob for File 1
  //   const blob1 = new Blob([data1], { type: 'text/plain' });
  //   const link1 = document.createElement('a');
  //   link1.href = window.URL.createObjectURL(blob1);
  //   link1.download = fileName;
  
  //   // Create Blob for File 2
  
  //   // Append the links to the document body
  //   document.body.appendChild(link1);
  
  
  //   // Trigger the click event for both links
  //   link1.click();
  
  
  //   // Remove the links from the document body
  //   document.body.removeChild(link1);
  
  // }

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
  
  
  
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const secretkeyFile = fileList[0];
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
      this.readFileContent(secretkeyFile);
    }
  }

  
  readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.secretkeyFileReaded = reader.result as string;
      // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้จากไฟล์ที่อัปโหลดที่นี่
      console.log('Secret Key File Content:', this.secretkeyFileReaded);
    };
  
    reader.readAsText(file);
  }
  
  Encryptionfile(){
  
    if(this.fileToEncryp){
      if(this.publickey !== '' && this.publickey !== undefined){
      this.sealService.getEncryptionFile(this.fileToEncryp,this.publickey).subscribe(response =>{
        this.fileEncrypted = response.cipherAbase64;
        console.log('File are Encrypted',this.fileEncrypted);
        this.service.success('publickey are created',this.publicKeyName);
      })
      }else{
        this.service.info('Please Input Name');
      }
    }else{
      this.service.info('Please Upload Secret Key')
  
    }
  
  }
  
  onFileChangeinputpublickey(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.publickey = fileList[0];
      const formData = new FormData();
      formData.append('file', this.publickey);
      console.log('this is form data ', formData);
      this.sealService.getEncryptionFiletest(formData).subscribe(response =>{
        // this.fileEncrypted = response.fileToEncryption;
        console.log('File are Encrypted',this.fileEncrypted);
        // this.service.success('publickey are created',this.publicKeyName);
      })
      this.readPublicKeyFileContent(this.publickey);
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
    }
  }
  
  onFileChangeinputfile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
      console.log('this is file use for encryption',file)
      this.fileToEncryp = file;
      console.log('this is file use for encryption',this.fileToEncryp)
    }
  }
  
  readPublicKeyFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.publickeyFileReaded = reader.result as string;
      // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้จากไฟล์ที่อัปโหลดที่นี่
      // console.log('publickeyFileReaded Key File Content:', this.publickeyFileReaded);
    };
  
    reader.readAsText(file);
  }
  
   //////////// downloadfile ///////////
  
   downloadFile() {
    const fileId = '';
    const fileName = '';
  
    this.downloadFileFunction(fileId, fileName);
  }
  
  private downloadFileFunction(fileId: any, fileName: any): void {
    const blob = new Blob([fileId], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
  
    // Append the link to the document body
    document.body.appendChild(link);
  
    // Trigger the click event for the link
    link.click();
  
    // Remove the link from the document body
    document.body.removeChild(link);
  }

  
}

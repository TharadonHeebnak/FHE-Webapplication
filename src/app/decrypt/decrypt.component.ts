import { Component, ElementRef, ViewChild } from '@angular/core';
import { SealService } from '../seal.service';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
// import {TooltipPosition} from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrl: './decrypt.component.scss'
})
export class DecryptComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  fileDecrypteds?: string;
  
 
  constructor(
    private sealService: SealService,
    private service: NotificationsService,
    private http: HttpClient,
    ) {}
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
  fileToDecrypt: File | null = null;
  fileEncrypted:File | null = null;
  fileDecrypted: File | null = null;
  
  
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
  

  
  downloadTxtFile(data: any,fileName:string) {
    if(this.fileName == undefined || null){
      this.fileName = 'fileName'
    }
    this.saveTxtFiles(data,fileName);
  }
  
  private saveTxtFiles(data1: any, fileName: string, ) {
    // Create Blob for File 1
    const blob1 = new Blob([data1], { type: 'text/plain' });
    const link1 = document.createElement('a');
    link1.href = window.URL.createObjectURL(blob1);
    link1.download = fileName;
  
    // Create Blob for File 2
  
    // Append the links to the document body
    document.body.appendChild(link1);
  
  
    // Trigger the click event for both links
    link1.click();
  
  
    // Remove the links from the document body
    document.body.removeChild(link1);
  
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
  
  Decryptionfile(){
    if(this.fileToDecrypt){
      if(this.secretkey !== '' && this.secretkey !== undefined){
      this.sealService.getDecryptionFile(this.fileToDecrypt,this.secretkey).subscribe(response =>{
        this.fileDecrypteds = response.decryptedFile;
        console.log('File are Decrypted',this.fileDecrypted);
        this.fileName = response.fileDecryptedName;
        this.service.success('File are Decrypted',this.fileName);
      })
      }else{
        this.service.info('Please Upload Secret Key');
      }
    }else{
      this.service.info('Please Upload file To Decrypt')
    }
  
  }
  downloadBase64(base64Data: string, filename: string) {
    console.log("base64Data",base64Data.length);
    const binaryString = atob(base64Data);
    console.log("binaryString",binaryString);
    const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const fileType = this.getFileMimeType(filename);
        console.log("fileType",fileType);
        console.log("bytes",bytes);

        const blob = new Blob([bytes.buffer], { type: fileType });
        console.log("blob",blob);

        
        

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

  }
  
  
  
  
  onFileChangeinputpublickey(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.secretkey = fileList[0];
      const formData = new FormData();
      formData.append('file', this.secretkey);
      console.log('this is form data ', formData);
      this.readPublicKeyFileContent(this.secretkey);
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
    }
  }
  
  onFileChangeinputfile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
      console.log('this is file use for encryption',file)
      this.fileToDecrypt = file;
      console.log('this is file use for fileToDecrypt',this.fileToDecrypt)
    }
  }
  
  readPublicKeyFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.secretkeyFileReaded = reader.result as string;
      // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้จากไฟล์ที่อัปโหลดที่นี่
      console.log('secretkeyFileReaded Key File Content:', this.secretkeyFileReaded);
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
  
  //////////////////////////////////////////////////////
  base64Data: string | null = null;

  convertToFile(): void {
    const fileInput = this.fileInputRef.nativeElement as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const base64String = (event?.target?.result as string)?.split(',')?.[1];
        this.base64Data = base64String;
        console.log("base64String",base64String);
        console.log("base64Data",this.base64Data);
        const binaryString = atob(base64String);
        console.log("base64Data",binaryString);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        console.log("type: file.type",file.type);
        
        const blob = new Blob([bytes.buffer], { type: file.type });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = file.name;
        a.click();
        window.URL.revokeObjectURL(url);

      };
    }
  }

  getFileMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      // เพิ่มเติมตามนามสกุลไฟล์ที่คุณต้องการจะรองรับ
      default:
        return 'application/octet-stream'; // ถ้าไม่รู้จักชนิดของไฟล์ให้ใช้ชนิด default
    }
  }
  
}

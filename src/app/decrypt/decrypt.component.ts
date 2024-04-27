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
  fileDecrypteds?: string;
  isLoading = false
  
  
    ngOnInit(): void {
    }

  readFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.secretkeyFileReaded = reader.result as string;
      // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้จากไฟล์ที่อัปโหลดที่นี่
    };
  
    reader.readAsText(file);
  }
  
  Decryptionfile(){
    if(this.fileToDecrypt){
      if(this.secretkey !== '' && this.secretkey !== undefined){
      this.isLoading = true
      this.sealService.getDecryptionFile(this.fileToDecrypt,this.secretkey).subscribe(response =>{
        this.fileDecrypteds = response.decryptedFile;
        this.fileName = response.fileDecryptedName;
        this.service.success('File are Decrypted',this.fileName);
        this.isLoading = false
      })
      }else{
        this.service.info('Please Upload Secret Key');
      }
    }else{
      this.service.info('Please Upload file To Decrypt')
    }
  
  }
  downloadBase64(base64Data: string, filename: string) {
    const binaryString = atob(base64Data);
    const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const fileType = this.getFileMimeType(filename);
        const blob = new Blob([bytes.buffer], { type: fileType });
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
      this.readPublicKeyFileContent(this.secretkey);
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
    }
  }
  
  onFileChangeinputfile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
      this.fileToDecrypt = file;
    }
  }
  
  readPublicKeyFileContent(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.secretkeyFileReaded = reader.result as string;
      // ทำสิ่งที่คุณต้องการกับข้อมูลที่ได้จากไฟล์ที่อัปโหลดที่นี่
    };
    reader.readAsText(file);
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

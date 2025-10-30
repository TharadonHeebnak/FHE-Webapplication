import { Component } from '@angular/core';
import { SealService } from '../seal.service';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
// import {TooltipPosition} from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { response } from 'express';


@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.component.html',
  styleUrl: './encrypt.component.scss'
})
export class EncryptComponent {


  constructor(
    private sealService: SealService,
    private service: NotificationsService,
    private http: HttpClient,
    ) {}
  secretkey: any;
  publickey: any;
  secretKeyName?: any;
  publicKeyName?: any;
  fileName = '';
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
  isLoading: boolean = false;


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



  downloadTxtFile(key: any,keyname:string) {
    if(this.secretKeyName == undefined || null){
      this.secretKeyName = 'Key'
    }
    this.saveTxtFiles(key,keyname);
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
    };

    reader.readAsText(file);
  }

  Encryptionfile() {
    if (!this.fileToEncryp) {
      this.service.warn("Please select a file first");
      return;
    }else if (!this.publickey) {
      this.service.warn("Please select public key file first");
      return;
    }
    this.isLoading = true;
    this.sealService.getEncryptionFile(this.fileToEncryp, this.publickey).subscribe(response => {
      this.fileEncrypted = response.cipherAbase64;
      this.fileName = response.fileEncryptedName;
      this.service.success(this.fileName, 'File are Encrypted');
      this.isLoading = false
    }, error => {
      this.service.error('Encryption failed', 'Invalid or corrupted public key. Please check your public key file and try again.');
      this.isLoading = false;
      this.fileEncrypted = null;
      this.publickey = null;
      const fileInputEncrypt = document.getElementById('fileEncryptInput') as HTMLInputElement;
      const keyInput = document.getElementById('publicKeyInput') as HTMLInputElement;
      if (fileInputEncrypt) fileInputEncrypt.value = '';
      if (keyInput) keyInput.value = ''
    });
  }

  onFileChangeinputpublickey(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.publickey = fileList[0];
      const formData = new FormData();
      formData.append('file', this.publickey);
      console.log('this is form data ', formData);
      this.readPublicKeyFileContent(this.publickey);
      // เรียกใช้ฟังก์ชั่นหรือทำสิ่งที่คุณต้องการกับไฟล์ที่อัปโหลดที่นี่
    }
  }

  onFileChangeinputfile(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.size <= 24000) { // 32kb in bytes
        this.fileToEncryp = file;
      } else {
        // Handle file size exceeds 32kb
        this.service.warn("Please select a file with size less than or equal to 24kb.");
        // alert("Please select a file with size less than or equal to 32kb.");
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
      }
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

  //////////////////////////////////////////////////////
}

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
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})


export class MainpageComponent {
  fileEncryptedName: any;
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
  fileEncrypted:File | null = null;
  creationCompleted: boolean = false;

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

  getsecretkey(){
    const secretKeyName = (document.getElementById('INPUT-secretkey-pair-name') as HTMLInputElement).value;
    if(secretKeyName !== '' && secretKeyName !== undefined){
      console.log('Key Pair Name:', secretKeyName);
      this.sealService.getsecretkey(secretKeyName).subscribe(response =>{
        this.secretkey = response.secretBase64Key;
        this.secretKeyName = response.secretKeyName;
        this.service.success('Secret Key are created',this.secretKeyName);
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
        this.creationCompleted = true;
      })
      }else{
        this.service.info('Please Input Name');
      }
    }else{
      this.service.info('Please Upload Secret Key')

    }

  }

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

  downloadEncryptFile(key: any,keyname:string) {
    this.saveEncryptFiles(key,keyname);
  }

  private saveEncryptFiles(data1: any, fileName: string, ) {
    // Create Blob for File 1
    const blob1 = new Blob([data1], { type: '' });
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
        const publickeyformData = new FormData();
        const fileEncrypformData = new FormData();
        publickeyformData.append('file',this.publickey)
      this.sealService.getEncryptionFile(this.fileToEncryp,this.publickey).subscribe(response =>{
        this.fileEncrypted = response.cipherAbase64;
        this.fileEncryptedName = response.cipherAbase64;
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
      // const formData = new FormData();
      // formData.append('file', fileList[0]);
      // console.log('this is form data ', formData);
      // this.sealService.getEncryptionFiletest(formData).subscribe(response =>{
      //   // this.fileEncrypted = response.fileToEncryption;
      //   console.log('File are Encrypted',this.fileEncrypted);
      //   // this.service.success('publickey are created',this.publicKeyName);
      // })



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

  //////////////////////////////////////////////////////

  
}

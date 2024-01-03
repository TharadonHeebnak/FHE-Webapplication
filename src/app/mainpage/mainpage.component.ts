import { Component } from '@angular/core';
import { SealService } from '../seal.service';



@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.scss',
})


export class MainpageComponent {
  secretkey: any;
  publickey: any;
  secretKeyName?: string;
  publicKeyName?: string;
  fileName?:string;


  constructor(
    private sealService: SealService,
    ) {}

    ngOnInit(): void {
      this.getSchemeType();
    }
  selectedSchemeType: string = 'bfv';
  isButtonDisabled = false;
  schemeType: any;
  securityLevel: any;
  selectedSecurityLevel: any;


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
      })
    }else{
      console.log('pleas in put name');

    }

  }

  getpublickey(){


    const publicKeyName = (document.getElementById('INPUT-public-key') as HTMLInputElement).value;
    console.log('GGGGGGG',publicKeyName);
    if(publicKeyName !== '' && publicKeyName !== undefined){
      this.sealService.getpublickey(publicKeyName,this.secretkey).subscribe(response =>{
        this.publickey = response.publicBase64Key;
        this.publicKeyName = response.publicKeyName;
        console.log('SDSADAD');
      })
    }

  }

  downloadTxtFile() {
    if(this.secretKeyName == undefined || null){
      this.secretKeyName = 'Key'
    }
    this.saveTxtFiles(this.secretkey,this.secretKeyName);
  }

  private saveTxtFiles(data1: any, fileName: string, ) {
    // Create Blob for File 1
    const blob1 = new Blob([data1], { type: 'text/plain' });
    const link1 = document.createElement('a');
    link1.href = window.URL.createObjectURL(blob1);
    link1.download = fileName + '_Secretkey.txt' || 'Secretkey.txt';

    // Create Blob for File 2

    // Append the links to the document body
    document.body.appendChild(link1);


    // Trigger the click event for both links
    link1.click();


    // Remove the links from the document body
    document.body.removeChild(link1);

  }

}

import { Component } from '@angular/core';
import { SealService } from '../seal.service';


@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrl: './encryption.component.scss'
})
export class EncryptionComponent {

  schemeType_arr = {
    none: {},
    bfv: {},
    ckks: {},
    bgv: {}
  };

  securityLevelOption = [
    {securityLevel:'none',value: 'none'},
    {securityLevel:'tc128', value:'128 Bits'},
    {securityLevel:'tc192', value: '192 Bits'},
    {securityLevel:'tc256', value: '256 Bits'},
  ];



  schemeType: any;
  result: number | undefined;
  selectedSchemeType: any;
  selectedSecurityLevel: any;
  securityLevel: any;
  sealOption: any;
  parms: any;
  secretkey: any;
  publickey: any;
  fileName: any;

  constructor(
    private sealService: SealService,
    ) {}

  ngOnInit(): void {
    this.getSchemeType()

    // เรียกใช้งาน NodeSEAL service
    // const keyPair = this.sealService.generateKeyPair();
    // console.log('Public Key:', keyPair.publicKey);
    // console.log('Secret Key:', keyPair.secretKey);
  }
  performSealOperation() {
    const data = { number1: 10, number2: 5 }; // Replace with your data
    this.sealService.performSealOperation(data).subscribe(response => {
      this.result = response.result;
    });
  }

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

  // getparms(){
  //   this.sealService.getparms().subscribe(response =>{
  //     this.parms = response.parms;
  //   })
  // }

  getkey(){
    this.sealService.getkey().subscribe(response =>{
      this.secretkey = response.secretBase64Key;
      this.publickey = response.publicBase64Key;
    })
  }

  downloadTxtFile() {
    if(this.fileName == undefined || null){
      this.fileName = 'Key'
    }
    this.saveTxtFiles(this.secretkey,this.publickey,this.fileName);
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


}

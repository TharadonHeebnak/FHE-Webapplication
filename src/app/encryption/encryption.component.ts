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
  constructor(private sealService: SealService) {}

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

}

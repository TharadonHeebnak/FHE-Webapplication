import { Component } from '@angular/core';
import { SealService } from '../seal.service';
import { Injectable } from '@angular/core';


@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrl: './encryption.component.scss'
})
export class EncryptionComponent {
  constructor(private sealService: SealService) {}

  ngOnInit(): void {
    // เรียกใช้งาน NodeSEAL service
    const keyPair = this.sealService.generateKeyPair();
    console.log('Public Key:', keyPair.publicKey);
    console.log('Secret Key:', keyPair.secretKey);
  }
}

// seal.service.ts
import { Injectable } from '@angular/core';
const seal = require('node-seal');

@Injectable({
  providedIn: 'root',
})
export class SealService {
  private context: any; // ปรับตามโครงสร้างของ NodeSEAL
  private keyGenerator: any; // ปรับตามโครงสร้างของ NodeSEAL

  constructor() {
    this.context = new seal.Context(); // ปรับตามโครงสร้างของ NodeSEAL
    this.keyGenerator = new seal.KeyGenerator(this.context); // ปรับตามโครงสร้างของ NodeSEAL
  }

  generateKeyPair(): any {
    const publicKey = this.keyGenerator.createPublicKey();
    const secretKey = this.keyGenerator.secretKey();
    return { publicKey, secretKey };
  }

  // เพิ่มเมธอดอื่น ๆ ตามต้องการ
}

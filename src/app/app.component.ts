import { Component } from '@angular/core';
import { SealService } from './seal.service';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Angular App with Microsoft SEAL</h2>
      <button (click)="performSealOperation()">Perform SEAL Operation</button>
      <div *ngIf="result !== undefined">
        Result: {{ result }}
      </div>
    </div>
  `
})
export class AppComponent {
  result: number | undefined;

  constructor(private sealService: SealService) {}

  performSealOperation() {
    const data = { number1: 10, number2: 5 }; // Replace with your data
    this.sealService.performSealOperation(data).subscribe(response => {
      this.result = response.result;
    });
  }
}

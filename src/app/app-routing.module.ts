import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputFileComponent } from './input-file/input-file.component';
import { EncryptionComponent } from './encryption/encryption.component';

const routes: Routes = [
  {
    path: 'input-file',
    component: InputFileComponent
  },
  {
    path: 'encryption',
    component:EncryptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

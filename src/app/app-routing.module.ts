import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EncryptionComponent } from './encryption/encryption.component';

const routes: Routes = [
  {
    path: 'mainpage',
    component:MainpageComponent
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

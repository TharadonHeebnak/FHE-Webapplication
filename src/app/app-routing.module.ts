import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EncryptionComponent } from './encryption/encryption.component';
import { SecondpageComponent } from './secondpage/secondpage.component';
import { ParameterComponent } from './parameter/parameter.component';
import { EncryptComponent } from './encrypt/encrypt.component';

const routes: Routes = [
  {
    path: 'mainpage',
    component:MainpageComponent
  },
  {
    path: 'encryption',
    component:EncryptionComponent
  },
  {
    path: 'secondpage',
    component:SecondpageComponent
  },
  {
    path: 'parameter',
    component:ParameterComponent
  },
  {
    path: 'encrypt',
    component:EncryptComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

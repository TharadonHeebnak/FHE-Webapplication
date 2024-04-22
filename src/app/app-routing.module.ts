import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EncryptionComponent } from './encryption/encryption.component';
import { SecondpageComponent } from './secondpage/secondpage.component';
import { EncryptComponent } from './encrypt/encrypt.component';
import { KeysComponent } from './keys/keys.component';
import { DecryptComponent } from './decrypt/decrypt.component';

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
    path: 'decrypt',
    component:DecryptComponent
  },
  {
    path: 'encrypt',
    component:EncryptComponent
  }, {
    path: 'keys',
    component:KeysComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

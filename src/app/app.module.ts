import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainpageComponent } from './mainpage/mainpage.component';
import { EncryptionComponent } from './encryption/encryption.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SimpleNotificationsModule  } from 'angular2-notifications';
import { SecondpageComponent } from './secondpage/secondpage.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EncryptComponent } from './encrypt/encrypt.component';
import { KeysComponent } from './keys/keys.component';
import { DecryptComponent } from './decrypt/decrypt.component';




@NgModule({
  declarations: [
    AppComponent,
    MainpageComponent,
    EncryptionComponent,
    SecondpageComponent,
    EncryptComponent,
    KeysComponent,
    DecryptComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    SimpleNotificationsModule.forRoot({
      position:["top", "right"],
      timeOut: 5000,
      lastOnBottom: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

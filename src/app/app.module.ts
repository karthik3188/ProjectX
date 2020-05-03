import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Globals } from './app.globals';

import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginPageModule } from './login/login.module';
import { VerificationPageModule } from './verification/verification.module';
import { RegisterPageModule } from './register/register.module';
import { SelfRegisterPageModule } from './self-register/self-register.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { APP_CONFIG, BaseAppConfig } from './app.config';
import { CountdownModule } from 'ngx-countdown';
import { TranslateConfigService } from './translate/translate-config.service';

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, RegisterPageModule, SelfRegisterPageModule, CountdownModule, IonicModule.forRoot(), AppRoutingModule, LoginPageModule, VerificationPageModule, 
    AngularFireAuthModule, AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule, AngularFireStorageModule,
    AngularFireDatabaseModule],
  providers: [
    Globals,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

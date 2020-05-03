import { Component, OnInit, Input, OnDestroy, ViewChild  } from '@angular/core';
import { NavController, NavParams, AlertController  } from '@ionic/angular'
import { TranslateConfigService } from '../translate/translate-config.service';
import { Globals } from '../app.globals';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {  SelfRegisterPage } from '../self-register/self-register.page'

import * as firebase from 'firebase';
import { CountdownTimer } from 'ngx-countdown';
import { getLocaleTimeFormat } from '@angular/common';
import { CountdownComponent } from 'ngx-countdown';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  selectedLanguage:string;
  phoneNumber: number;
  userName: string;

  constructor(
    private navCtrl: NavController,
    private route: Router,
    public alertCtrl:AlertController,
    private translateConfigService: TranslateConfigService,
    public globals: Globals,
    private translate: TranslateService
  ) { }

  
  ionViewWillEnter()
  {
    console.log("Im a verification refreshed page");
    this.translateConfigService.currentLanguae.subscribe(message => this.selectedLanguage = message );
    this.translateConfigService.currentUserName.subscribe(message => this.userName = message);
    this.translateConfigService.currentPhoneNumber.subscribe(message => this.phoneNumber = message );
    console.log(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  languageChanged(){
    console.log(this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  goBack()
  {
  

  }

  ngOnInit() {

  }

  goToSelfRegisterPage()
  {
    this.route.navigate(['./self-register']);
  }

  goToSearchPage()
  {
    //this.route.navigate(['./search']);
  }

}

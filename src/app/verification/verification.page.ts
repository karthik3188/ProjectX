import { Component, OnInit, Input, OnDestroy, ViewChild, OnChanges  } from '@angular/core';
import { NavController, NavParams, AlertController  } from '@ionic/angular'
import { TranslateConfigService } from '../translate/translate-config.service';
import { Globals } from '../app.globals';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


import * as firebase from 'firebase';
import { CountdownTimer } from 'ngx-countdown';
import { getLocaleTimeFormat } from '@angular/common';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  selectedLanguage:string;
  message: any;
  phoneNumber: number;
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  confirmationResult:firebase.auth.ConfirmationResult;
  enteredOTP: any;
  count: any;
  @ViewChild('countdown', {static: true}) counter: CountdownComponent;
  

  constructor(
    private navCtrl: NavController,
    private route: Router,
    public alertCtrl:AlertController,
    private translateConfigService: TranslateConfigService,
    public globals: Globals,
    private translate: TranslateService,
    private navParams: NavParams,
    private Acivatedroute: ActivatedRoute
  ) {
     //this.count = CountdownTimer(30000, 1000);
  }

  ionViewWillEnter()
  {
    console.log("Im a verification refreshed page");
    this.translateConfigService.currentMessage.subscribe(message => this.message = message );
    this.translateConfigService.currentLanguae.subscribe(message => this.selectedLanguage = message );
    this.translateConfigService.currentPhoneNumber.subscribe(message => this.phoneNumber = message );
    console.log(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);   
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log("recapcha verified. ", response);        
      }      
    });
    this.validateOTP();
  }

  ionViewWillLeave()
  {
    console.log("I'm leave verification page");

  }
 
  ngOnInit() {
    console.log("Im a ngonit verification page"); 
        
   }


   validateOTP(){
     this.counter.restart();
    console.log("inside validateOTP");
    console.log(this.phoneNumber);
    console.log(this.recaptchaVerifier);
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+91" + this.phoneNumber;
    console.log(phoneNumberString);
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( result => {
        console.log("inside firebase")
        this.confirmationResult = result;
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  
  }
  
  async wrongOTPalert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'Wrong OTP',
      buttons: ['OK']
    });

    await alert.present();
  }
  
  submit()
  {
    this.confirmationResult.confirm(this.enteredOTP).then( res =>
    {      
      console.log(res.user.uid);
      this.translateConfigService.setuserUID(res.user.uid);
      this.route.navigate(['./register']);
    }

    ).catch(function (error) {
      alert("Wrong OTP!!!");
    });
  }
  
}

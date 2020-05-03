import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonApp, NavController, AlertController } from '@ionic/angular';

import { TranslateConfigService } from '../translate/translate-config.service';
import { VerificationPage } from '../verification/verification.page';
import { Globals } from '../app.globals';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNumber: number;
  userName: string;
  selectedLanguage:string;

  constructor(
    private navCtrl: NavController,
    private route: Router,
    private translateConfigService: TranslateConfigService,
    private formBuilder: FormBuilder,
    public alertCtrl:AlertController,
    public globals: Globals,
    private translate: TranslateService
  ) { 
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    console.log(this.selectedLanguage);
    
    }

    async language(){
      let prompt = await this.alertCtrl.create({
        message: 'Select your language',
        inputs: [{ name: 'language', type:'radio', label:'English', value:'en', checked: true},
                 { name: 'language', type:'radio', label:'தமிழ்(Tamil)', value:'ta'},
                 { name: 'language', type:'radio', label:'हिन्दी(Hindi)', value:'hi'},
                 { name: 'language', type:'radio', label:'తెలుగు(Telugu)', value:'te'}, 
                 { name: 'language', type:'radio', label:'മലയാളം(Malayalam)', value:'ma'},
                 { name: 'language', type:'radio', label:'ಕನ್ನಡ(Kannada)', value:'ka'}],
        buttons: [          
          { text: 'OK',
            handler: data => {
              this.selectedLanguage= data;        
            }
          }
        ]
      })
     await prompt.present();
    }
  languageChanged(){
    console.log(this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  ionViewWillEnter()
  {
    console.log("Im a refreshed page-login");
  }

  ngOnInit() {      
    this.language();
    
  }
 
  sendOTP(){
    this.translateConfigService.setUserName(this.userName);
    this.translateConfigService.setPhoneNumber(this.phoneNumber);
    this.route.navigate(['./verification']);
  }
}

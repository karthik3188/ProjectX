import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, BehaviorSubject  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  private selectedLanguage = new BehaviorSubject('en');
  currentLanguae = this.selectedLanguage.asObservable();

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  
  private phoneNumber = new BehaviorSubject(0);
  currentPhoneNumber = this.phoneNumber.asObservable();

  private userName = new BehaviorSubject('');
  currentUserName = this.userName.asObservable();

  private userUID = new BehaviorSubject('');
  currentUserUID = this.userUID.asObservable();
  

  constructor(
    private translate: TranslateService
  ) { }

  setuserUID(uUID: string) {
    console.log(uUID);
    this.userUID.next(uUID)
  }

  changeMessage(message: string) {
    console.log(message);
    this.messageSource.next(message)
  }

  setPhoneNumber(pnumber: number) {
    console.log(pnumber);
    this.phoneNumber.next(pnumber)
  }

  setUserName(uname: string) {
    console.log(uname);
    this.userName.next(uname)
  }


  getDefaultLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    return language;
  }
 
  setLanguage(setLang) {
    console.log(setLang);
    this.translate.use(setLang);
    this.selectedLanguage.next(setLang);
  }

}

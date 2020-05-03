import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
 
@Injectable()
export class AuthenticateService {
 
  constructor(){}

 
  logoutUser(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
          console.log("LOG Out");
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }
 

  userDetails(){
    return firebase.auth().currentUser;
  }
}
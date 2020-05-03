import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
 
@Injectable({
  providedIn: 'root'
})
export class CrudService {
 
   
  constructor(
    private firestore: AngularFirestore
  ) { }
 
 
  create_NewAccount(record, country, state, district, uUID) {
    //return this.firestore.collection('/ServiceProviders').doc(country).collection('States').doc(state).collection('Districts').doc(district).collection('Providers').add(record);
    return this.firestore.collection('/ServiceProviders').doc(country).collection('States').doc(state).collection('Districts').doc(district).collection('Providers').doc(uUID).set(record);
  }
 
  read_Account(skillfinder) {
    //return this.firestore.collection('/Accounts', ref => ref.where("hash", ">=", skillfinder.lower)
    //.where("hash", "<=", skillfinder.upper).where("Skill", "array-contains-any", "solution")).snapshotChanges();
    return this.firestore.collection('/Accounts', ref => ref.where("hash", ">=", skillfinder.lower)
    .where("hash", "<=", skillfinder.upper).where("Name", "in", ["karthik"])).snapshotChanges();
  }
 
  update_Account(recordID,record){
    this.firestore.doc('Accounts/' + recordID).update(record);
  }
 
  delete_Account(record_id) {
    this.firestore.doc('Accounts/' + record_id).delete();
  }
  
}
 
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMap} from '@agm/core';
import { TranslateConfigService } from '../translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, AlertController  } from '@ionic/angular';
import { Router } from '@angular/router';
import { Globals } from '../app.globals';
import { CrudService } from './../service/crud.service';
import geohash from "ngeohash";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import * as firebase from 'firebase';

//Image upload
export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-self-register',
  templateUrl: './self-register.page.html',
  styleUrls: ['./self-register.page.scss'],
})




export class SelfRegisterPage implements OnInit {
  title: string = 'Project X';
  latitude: number;
  longitude: number;
  zoom:number;
  address: string;
  private geoCoder;
  location: string;
  locality: string;
  selectedLanguage:string;
  phoneNumber: number;
  userName: string;
  postcode: string;
  state: string;
  district: string;
  country: string;
  place: string;
  streetNumber : string;
  addressRoute: string;
  dateOfBirth: Date;
  aadharNumber: number;
  skills: string;
  category: string;
  image: string;
  userUID: string;
  ImagefileName: string;
  ImageFilePath: string;
  ImagefileSize: number;

  // Upload Task 
  task: AngularFireUploadTask;
 
  // Progress in percentage
  percentage: Observable<number>;
 
  // Snapshot of uploading file
  snapshot: Observable<any>;
 
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
 
  //Uploaded Image List
  //images: Observable<MyData[]>;

  //File details  
  fileName:string;
  fileSize:number;
 
  //Status check 
  isUploading:boolean;
  isUploaded:boolean;

  @ViewChild('search',{static:false})
  public searchElementRef: ElementRef;
  private imageCollection: AngularFirestoreCollection<MyData>;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private navCtrl: NavController,
    private route: Router,
    public alertCtrl:AlertController,
    private translateConfigService: TranslateConfigService,
    public globals: Globals,
    private translate: TranslateService,
    private crudService: CrudService,
    private storage: AngularFireStorage, 
    private database: AngularFirestore
  ) {
    //upload image
    this.isUploading = false;
    this.isUploaded = false;
    
    //Set collection where our documents/ images info will save
   // this.imageCollection = database.collection<MyData>('freakyImages');
    //this.images = this.imageCollection.valueChanges();
   }

  ionViewWillEnter()
  {
    console.log("Im a verification refreshed page");
    this.translateConfigService.currentLanguae.subscribe(message => this.selectedLanguage = message );
    this.translateConfigService.currentUserName.subscribe(message => this.userName = message);
    this.translateConfigService.currentPhoneNumber.subscribe(message => this.phoneNumber = message );
    this.translateConfigService.currentUserUID.subscribe(message => this.userUID = message);
    console.log(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }

  languageChanged(){
    console.log(this.selectedLanguage);
    this.translateConfigService.setLanguage(this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
  }
  
  ngOnInit() {
    console.log("Inside onInit");
     //load Places Autocomplete
     this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        console.log("Inside onInit listener");
        this.ngZone.run(() => {
          this.postcode= "";
          this.state= "";
          this.district= "";
          this.country= "";
          this.place= "";
          this.streetNumber= "";
          this.addressRoute= "";
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;        
          this.getAddress(place.geometry.location.lat(),place.geometry.location.lng());  
        });
      });
    });
  }

   // Get Current Location Coordinates
   private setCurrentLocation() {
    console.log("Inside currentlocation");
    if ('geolocation' in navigator) {
      console.log("Inside current location navigator");
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        mapType: "satelite";
        this.zoom = 15;
        this.getAddress(position.coords.latitude,position.coords.longitude);
      });
         }
  }

  markerDragEnd($event: any) {
    console.log("Inside markerdrag");
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  
  getAddress(latitude, longitude) {
    console.log("Inside getAddress");
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log("Inside Geocode");
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {              
              
              if (results[0].address_components[i].types[b] == "street_number") {
                //this is the object you are looking for
                console.log("street_number")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.streetNumber = obj.long_name;
                break;
            }
            if (results[0].address_components[i].types[b] == "route") {
                //this is the object you are looking for
                console.log("route")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.addressRoute = obj.long_name;

                break;
            }
              if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                //this is the object you are looking for
                console.log("administrative_area_level_2")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.district = obj.long_name;
                this.place = this.streetNumber + " " + this.addressRoute;
                break;
            }
              if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                console.log("administrative_area_level_1")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.state = obj.long_name;
                break;
            }
              if (results[0].address_components[i].types[b] == "country") {
                //this is the object you are looking for
                console.log("country")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.country = obj.long_name;
                break;
            }
              if (results[0].address_components[i].types[b] == "postal_code") {
                //this is the object you are looking for
                console.log("Postal code")
                console.log(results[0].address_components[i])
                var obj = results[0].address_components[i];
                this.postcode = obj.long_name;
                break;
            }
          }
        }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
  
    });
  }

  getGeohashRange = (
    flatitude: number,
    flongitude: number,
    distance: number,
  ) => {
    console.log(flatitude);
    console.log(flongitude);
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile
    const miles = distance * 0.000621371192;
    console.log(miles);
    const lowerLat = flatitude - lat * miles;
    const lowerLon = flongitude - lon * miles;
  
    const greaterLat = flatitude + lat * miles;
    const greaterLon = flongitude + lon * miles;
  
    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(greaterLat, greaterLon);
    
    console.log(miles);
    console.log(lower);
    console.log(upper);
    return {
      lower,
      upper
    };
  };

  CreateRecord(){
    var arraySkill = this.skills.split(',');
    var hashKey = geohash.encode(this.latitude, this.longitude);

    let record = {};
      record['Name'] = this.userName;
      record['PhoneNumber'] = this.phoneNumber;
      record['ArraySkill'] = arraySkill;
      record['Latitude'] = this.latitude;
      record['Longitude'] = this.longitude;
      record['Address'] = this.address;
      record['PostCode'] = this.postcode;
      record['State'] = this.state;
      record['District'] = this.district;
      record['Country'] = this.country;
      record['Place'] = this.place;
      record['StreetNumber'] = this.streetNumber;
      record['AddressRoute'] = this.addressRoute;
      record['DateOfBirth'] = this.dateOfBirth;
      record['AadharNumber'] = this.aadharNumber;
      record['Category'] = this.category;     
      record['UserUID'] = this.userUID;
      record['HashKey'] = hashKey;
      record['ImageFileName'] = this.ImagefileName;
      record['ImageFilePath'] = this.ImageFilePath;
      record['ImageSize'] = this.ImagefileSize;
      
      this.crudService.create_NewAccount(record, this.country, this.state, this.district, this.userUID).then(resp => {
        this.userName = "";
        this.phoneNumber = undefined;
        arraySkill = [];
        this.latitude = undefined;
        this.longitude = undefined;
        this.address = "";
        this.postcode = "";
        this.state = "";
        this.district = "";
        this.country = ";";
        this.place = "";
        this.streetNumber = "";
        this.addressRoute = "";
        this.dateOfBirth = undefined;
        this.aadharNumber = undefined;
        this.category = "";
//        this.image = "";
        this.userUID = "";
        hashKey = "";        
        this.ImagefileName = "";
        this.ImageFilePath = undefined;
        this.ImagefileSize = undefined;
        console.log(resp);
      })
        .catch(error => {
          console.log(error);
        });
  
  }

  uploadFile(event: FileList) {
    

    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path
    const path = `projectXstorage/${this.country}/${this.state}/${this.district}/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'projectX upload user image' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();           
        
        this.UploadedFileURL.subscribe(resp=>{
          this.addImagetoDB({
            name: this.fileName,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }

  

  deleteImage()
  {
    console.log("Inside deleteImage method");
    var deleteRef = this.storage.storage.refFromURL(this.ImageFilePath);
    
       
    deleteRef.delete().then(del => 
       {
          this.isUploaded = false;
          this.isUploading = false;
          console.log("Image deleted");
       }).catch(function(error) {
  // Uh-oh, an error occurred!
});
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    //const id = this.database.createId();
    //console.log(id);
    console.log(image.filepath);
    console.log(image.name);
    console.log(image.size);
    //Set document id with value in database
    //this.imageCollection.doc(id).set(image).then(resp => {
      //console.log(resp);
    //}).catch(error => {
      //console.log("error " + error);
    //});
    this.ImagefileName = image.name;
    this.ImageFilePath = image.filepath;
    this.ImagefileSize = image.size;

  }

}

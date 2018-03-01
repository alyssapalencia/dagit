import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, NavParams, App } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';

// IMPORTED PAGES
import { LoginPage } from '../login/login';

declare var google;

@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {

  today = new Date();
  rateParkingInfo: any;
  //updateParkingInfo: any;
  parkingStatus: any;
  mapUpdate: any;
  userDetail: any;
  
  // USER DETAILS
  session: any;
  fName: any;
  lName: any;
  location: any;
  latitude: any;
  longitude: any;

  // DB FETCH
  dbCategory: any[] = [];
  dbParking: any[] = [];
  dbTime: any[] = [];
  dbFName: any[] = [];
  dbLName: any[] = [];
  dbLocation: any[] = [];
  dbLocLat: any[] = [];
  dbLocLng: any[] = [];

  // LATEST UPDATE
  lastParking = '';
  lastTime: any;
  rating: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public navParams: NavParams, public firebase: Firebase, private geolocation: Geolocation, private app: App) {
    this.parkingStatus = this.firebase.getParking();
    this.session = this.firebase.getSession();
    this.userDetail = this.firebase.getUserDetail();

    var j = 0;
    this.session.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbFName[j] = snapshot.val().fName;
        this.dbLName[j] = snapshot.val().lName;
        this.dbLocation[j] = snapshot.val().location;
        this.dbLocLat[j] = snapshot.val().latitude;
        this.dbLocLng[j] = snapshot.val().longitude;
        j++;
      });
    });

    var i = 0;
    this.parkingStatus.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbCategory[i] = snapshot.val().category;
        this.dbParking[i] = snapshot.val().notifDetail;
        this.dbTime[i] = snapshot.val().timeStamp;
        i++;
      });
    });

    this.getUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingPage');
  }

  addParking(info) {
    this.getUser();
    var k = 0;
    this.rateParkingInfo = {
      "category": 'Parking',
      "subcategory": info,
      "notifDetail": info + ' Parking: ' + this.location,
      "timeStamp": moment().format('MMMM Do YYYY, hh:mm:ss A').toString(),
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now()
    };
    this.firebase.addParking(this.rateParkingInfo);

    this.mapUpdate = {
      "platitude": this.latitude + 0.0001,
      "plongitude": this.longitude + 0.0001,
      "parkingAvailability": info + ' Parking',
      "parkingTimeStamp": moment().format('MMMM Do YYYY, hh:mm:ss A').toString(),
      "pFName": this.fName,
      "pLName": this.lName
    }

    this.firebase.updateMapData(this.location, this.mapUpdate);
  }

  getLastParking() {
    for(var i = 0; i<this.dbParking.length; i++) {
     if(this.dbCategory[i] == 'Parking'){
      this.lastParking = this.dbParking[i];
     }
    }
    return this.lastParking;
  }

  getLastTime() {
    for(var i = 0; i<this.dbTime.length; i++) {
     if(this.dbCategory[i] == 'Parking'){
      this.lastTime = this.dbTime[i];
     }
    }
    return this.lastTime;
  }

  getRating(){
    for(var i = 0; i<this.dbParking.length; i++) {
      if(this.dbCategory[i] == 'Parking'){
       this.lastParking = this.dbParking[i];
      }
    }
    if(this.lastParking.startsWith("Available")){
      this.rating = this.lastParking.slice(0, 9);
    }
    else if(this.lastParking.startsWith("No Available")){
      this.rating = this.lastParking.slice(0, 12);
    }
    return this.rating;
  }

  getUser(){
    for(var i = 0; i<this.dbFName.length; i++) {
      this.fName = this.dbFName[i];
    }

    for(var j = 0; j<this.dbLName.length; j++) {
        this.lName = this.dbLName[j];
    }

    for(var k = 0; k<this.dbLocation.length; k++) {
      this.location = this.dbLocation[k];
    }

    for(var l = 0; l<this.dbLocLat.length; l++) {
      this.latitude = this.dbLocLat[l];
    }

    for(var m = 0; m<this.dbLocLng.length; m++) {
      this.longitude = this.dbLocLng[m];
    }
  }

  // LOGOUT
  logout() {
    let confirm = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log("no clicked");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log("yes clicked");
            this.app.getRootNav().setRoot(LoginPage);
            let toast = this.toastCtrl.create({
              message: 'You have successfully logged out.',
              duration: 2000
            });
            toast.present();
          }
        }
      ]
    });
    confirm.present();
  }
}

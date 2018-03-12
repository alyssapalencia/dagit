/* UPDATE AS OF MARCH 11, 2018 @ 7:30AM                             *
 * Removed declare var google;                                      *
 * Removed import { Geolocation } from '@ionic-native/geolocation'; *
 * Removed private geolocation: Geolocation                         *
 * Removed var k = 0; from addParking(info)                         */

import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, NavParams, App } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
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
  parkingStatus: any;
  mapUpdate: any;
  location: any;

  currUser: any;
  currLoc: any;

  // LATEST UPDATE
  lastParking = '';
  lastTime: any;

  // LAST LOCATION
  lastLat: any;
  lastLng: any;
  lastLoc: any;
  place: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public navParams: NavParams, public firebase: Firebase, private app: App) {
    this.currUser = firebase.getCurrentUser();
    this.parkingStatus = this.firebase.getMap();
    this.currLoc = this.firebase.getLocation();

    this.parkingStatus.subscribe(snapshot => {
      snapshot.forEach(snap => {
        if(this.currUser.location == snap.$key){
          this.lastParking = snap.parkingAvailability;
          this.lastTime = snap.parkingTimeStamp;
          this.location = snap.$key;
        }
      });
    });

    this.currLoc.subscribe(snapshot => {
      snapshot.forEach(snap => {
        if(this.currUser.fName == snap.fName && this.currUser.lName == snap.lName) {
          this.lastLat = snap.lat;
          this.lastLng = snap.lng;
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingPage');
  }

  addParking(info) {
    this.rateParkingInfo = {
      "category": 'Parking',
      "subcategory": info,
      "notifDetail": info + ' Parking near ' + this.currUser.location,
      "timeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "fName": this.currUser.fName,
      "lName": this.currUser.lName,
      "sort": 0 - Date.now()
    };
    this.firebase.addParking(this.rateParkingInfo);
    const date = moment().format('MMMM D YYYY');
    this.firebase.addNotifLog(date, this.rateParkingInfo);

    this.mapUpdate = {
      "platitude": this.lastLat + 0.0001,
      "plongitude": this.lastLng + 0.0001,
      "parkingAvailability": info + ' Parking',
      "parkingTimeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "pFName": this.currUser.fName,
      "pLName": this.currUser.lName
    }
    this.firebase.updateMapData(this.currUser.location, this.mapUpdate);
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
            this.firebase.watchUserLocation('logout');
            this.firebase.providerLogout();
            this.app.getRootNav().setRoot(LoginPage);
            let toast = this.toastCtrl.create({
              message: 'You have successfully logged out',
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

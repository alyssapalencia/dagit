/* UPDATE AS OF MARCH 11, 2018 @ 7:38AM                             *
 * Removed declare var google;                                      *
 * Removed import { Geolocation } from '@ionic-native/geolocation'; *
 * Removed import { Observable } from 'rxjs/Rx';                    *
 * Removed private geolocation: Geolocation                         */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import * as moment from 'moment';

// IMPORTED PAGES
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-rate-traffic',
  templateUrl: 'rate-traffic.html',
})
export class RateTrafficPage {

  today = new Date();
  rateTrafficInfo: any;
  //updateTrafficInfo: any;
  trafficStatus: any;
  mapUpdate: any;
  location: any;

  currUser: any;
  currLoc: any;
  lastUpdate: any;

  // LATEST UPDATE
  lastTraffic: any;;
  lastTime: any;

  // LAST LOCATION
  lastLat: any;
  lastLng: any;
  lastLoc: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public firebase: Firebase, public alertCtrl: AlertController, private app: App, public toastCtrl: ToastController) {
    this.lastTime = moment().format('MMMM Do YYYY, hh:mm A').toString();
    this.currUser = firebase.getCurrentUser();
    this.currLoc = this.firebase.getLocation();

    this.currLoc.subscribe(snapshot => {
      snapshot.forEach(snap => {
        if(this.currUser.fName == snap.fName && this.currUser.lName == snap.lName) {
          this.lastLat = snap.lat;
          this.lastLng = snap.lng;
          console.log(snap.lat, snap.lng);
        }
      });
    });
  }

  addRateTraffic(info) {
    this.lastTime = moment().format('MMMM Do YYYY, hh:mm A').toString();

    this.rateTrafficInfo = {
      "category": 'Traffic',
      "subcategory": info,
      "notifDetail": info + ' Traffic near ' + this.currUser.location,
      "timeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "fName": this.currUser.fName,
      "lName": this.currUser.lName,
      "sort": 0 - Date.now()
    };
    this.firebase.addRateTraffic(this.rateTrafficInfo);
    const date = moment().format('MMMM D YYYY');
    this.firebase.addNotifLog(date, this.rateTrafficInfo);

    this.mapUpdate = {
      "tlatitude": this.lastLat,
      "tlongitude": this.lastLng,
      "trafficRating": info + ' Traffic',
      "timeUpdated": Date.now(),
      "trafficTimeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "tFName": this.currUser.fName,
      "tLName": this.currUser.lName
    };
    var lat = this.lastLat.toString();
    var finalLat = lat.replace('.', '-');
    var lng = this.lastLng.toString();
    var finalLng = lng.replace('.', '-');
    var lastCoords = finalLat + finalLng;
    this.firebase.mapUpdateService(lastCoords, this.mapUpdate);
    //this.firebase.updateMapData(this.currUser.location, this.mapUpdate);
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
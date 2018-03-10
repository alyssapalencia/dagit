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

  // LATEST UPDATE
  lastTraffic: any;;
  lastTime: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public firebase: Firebase, public alertCtrl: AlertController, private app: App, public toastCtrl: ToastController) {
    this.currUser = firebase.getCurrentUser();
    this.trafficStatus = this.firebase.getMap();
    this.trafficStatus.subscribe(snapshot => {
      snapshot.forEach(snap => {
        if(this.currUser.location == snap.$key){
          this.lastTraffic = snap.trafficRating;
          this.lastTime = snap.trafficTimeStamp;
          this.location = snap.$key;
        }
      });
    });
  }

  addRateTraffic(info) {

    this.rateTrafficInfo = {
      "category": 'Traffic',
      "subcategory": info,
      "notifDetail": info + ' Traffic: ' + this.currUser.location,
      "timeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "fName": this.currUser.fName,
      "lName": this.currUser.lName,
      "sort": 0 - Date.now()
    };
    this.firebase.addRateTraffic(this.rateTrafficInfo);
    const date = moment().format('MMMM D YYYY');
    this.firebase.addNotifLog(date, this.rateTrafficInfo);

    this.mapUpdate = {
      "tlatitude": this.currUser.locLat,
      "tlongitude": this.currUser.locLng,
      "trafficRating": info + ' Traffic',
      "timeUpdated": Date.now(),
      "trafficTimeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "tFName": this.currUser.fName,
      "tLName": this.currUser.lName
    };
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
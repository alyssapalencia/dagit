import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

// IMPORTED PAGES
import { LoginPage } from '../login/login';

declare var google;

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
  userDetail: any;

  // USER DETAILS
  session: any;
  fName: any;
  lName: any;
  location: any;
  latitude: any;
  longitude: any;
  
  // DB FETCH
  dbUsers: any[] = [];
  dbCategory: any[] = [];
  dbTraffic: any[] = [];
  dbTime: any[] = [];
  dbFName: any[] = [];
  dbLName: any[] = [];
  dbLocation: any[] = [];
  dbLocLat: any[] = [];
  dbLocLng: any[] = [];

  // LATEST UPDATE
  lastTraffic = "";
  lastTime: any;
  rating: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public firebase: Firebase, public alertCtrl: AlertController, 
    private geolocation: Geolocation, private app: App, public toastCtrl: ToastController) {
    this.trafficStatus = this.firebase.getRateTraffic();
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
    this.trafficStatus.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbCategory[i] = snapshot.val().category;
        this.dbTraffic[i] = snapshot.val().notifDetail;
        this.dbTime[i] = snapshot.val().timeStamp;
        i++;
      });
    });

    this.getUser();
  }

  addRateTraffic(info) {
    this.getUser();

    this.rateTrafficInfo = {
      "category": 'Traffic',
      "subcategory": info,
      "notifDetail": info + ' Traffic: ' + this.location,
      "timeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now()
    };
    this.firebase.addRateTraffic(this.rateTrafficInfo);
    const date = moment().format('MMMM D YYYY');
    this.firebase.addNotifLog(date, this.rateTrafficInfo);

    this.mapUpdate = {
      "tlatitude": this.latitude,
      "tlongitude": this.longitude,
      "trafficRating": info + ' Traffic',
      "trafficTimeStamp": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "tFName": this.fName,
      "tLName": this.lName
    };
    this.firebase.updateMapData(this.location, this.mapUpdate);
  }

  getLastTraffic() {
    for(var i = 0; i<this.dbTraffic.length; i++) {
     if(this.dbCategory[i] == 'Traffic'){
      this.lastTraffic = this.dbTraffic[i];
     }
    }
    return this.lastTraffic;
  }

  getLastTime() {
    for(var i = 0; i<this.dbTime.length; i++) {
     if(this.dbCategory[i] == 'Traffic'){
      this.lastTime = this.dbTime[i];
     }
    }
    return this.lastTime;
  }

  getRating(){
    var rate;
    for(var i = 0; i<this.dbTraffic.length; i++) {
      if(this.dbCategory[i] == 'Traffic'){
       this.lastTraffic = this.dbTraffic[i];
      }
    }
    this.rate();
    return this.rating;
  }
  
  rate(){
    if(this.lastTraffic.startsWith("Light")){
      this.rating = this.lastTraffic.slice(0, 5);
    }
    else if(this.lastTraffic.startsWith("Moderate")){
      this.rating = this.lastTraffic.slice(0, 8);
    }
    else if(this.lastTraffic.startsWith("Heavy")){
      this.rating = this.lastTraffic.slice(0, 5);
    }
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
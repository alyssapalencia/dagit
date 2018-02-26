import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

declare var google;

@IonicPage()
@Component({
  selector: 'page-rate-traffic',
  templateUrl: 'rate-traffic.html',
})
export class RateTrafficPage {

  today = new Date();
  rateTrafficInfo: any;
  trafficStatus: any;
  addUpdateInfo: any;
  userDetail: any;
  location: any;

  dbCategory: any[] = [];
  dbTraffic: any[] = [];
  dbTime: any[] = [];
  dbLocation: any[] = [];
  dbLocLat: any[] = [];
  dbLocLng: any[] = [];

  lastTraffic = "";
  lastTime: any;
  rating: any;
  test: any;

  session: any;
  dbFName: any[] = [];
  dbLName: any[] = [];
  fName: any;
  lName: any;

  lat: any;
  lng: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public alertCtrl: AlertController, private geolocation: Geolocation) {
    console.log(moment().format('MM/DD/YYYY hh:mm:ss A').toString());
    this.trafficStatus = this.firebase.getRateTraffic();
    this.session = this.firebase.getSession();
    this.userDetail = this.firebase.getUserDetail();

    /*Observable.interval(5000)
    .subscribe((val) => {
      this.updateLocation();
    });*/
    
    var k = 0;
    this.userDetail.subscribe(snapshot => {
      snapshot.forEach(snap => {
        this.dbLocation[k] = snap.val().location;
        this.dbLocLat[k] = snap.val().locLat;
        this.dbLocLng[k] = snap.val().locLng;
        console.log(snap.val().location);
        console.log(snap.val().locLat);
        console.log(snap.val().locLng);
        k++;
      });
    });

    var j = 0;
    this.session.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbFName[j] = snapshot.val().fName;
        this.dbLName[j] = snapshot.val().lName;
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

  updateLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      var location = {
        "lat": position.coords.latitude,
        "lng": position.coords.longitude,
        "timeStamp": moment().format('MM/DD/YYYY hh:mm:ss A').toString()
      }
      console.log(position.coords.latitude, position.coords.longitude);
      this.firebase.updateLocation(location);
    });
  }

  addRateTraffic(info) {
    this.getUser();       
    var k = 0;
    this.rateTrafficInfo = {
      "category": 'Traffic',
      "subcategory": info,
      "notifDetail": info + ' Traffic: ' + this.dbLocation[k],
      "locLat": this.dbLocLat[k],
      "locLng": this.dbLocLng[k],
      "timeStamp": moment().format('MM/DD/YYYY hh:mm:ss A').toString(),
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now()
    };
     this.firebase.getMap().subscribe(snapshot => {
      snapshot.forEach(snap => {
        console.log("traffic log");
        if(snap.fName == this.fName) {
          var key = snap.$key;
          this.firebase.updateRateTraffic(this.rateTrafficInfo, key);
        }
      });
      if(snapshot.length == 0) {
        this.firebase.addRateTraffic(this.rateTrafficInfo);
      }
    });
    this.firebase.updateRateNotif(this.rateTrafficInfo);
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
  }
}

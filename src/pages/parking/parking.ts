import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';

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
  userDetail: any;
  location: any;

  dbCategory: any[] = [];
  dbParking: any[] = [];
  dbTime: any[] = [];
  dbLocation: any[] = [];
  dbLocLat: any[] = [];
  dbLocLng: any[] = [];

  lastParking = '';
  lastTime: any;
  rating: any;

  session: any;
  dbFName: any[] = [];
  dbLName: any[] = [];
  fName: any;
  lName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, private geolocation: Geolocation) {
    console.log(moment().format('MM/DD/YYYY hh:mm:ss A').toString());
    this.parkingStatus = this.firebase.getParking();
    this.session = this.firebase.getSession();
    this.userDetail = this.firebase.getUserDetail();

    var k = 0;
    this.userDetail.subscribe(snapshot => {
      snapshot.forEach(snap => {
        this.dbLocation[k] = snap.val().location;
        this.dbLocLat[k] = snap.val().locLat;
        this.dbLocLng[k] = snap.val().locLng;
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
    var k = 0;
    this.rateParkingInfo = {
      "category": 'Parking',
      "subcategory": info,
      "notifDetail": info + ' Parking: ' + this.dbLocation[k],
      "locLat": this.dbLocLat[k],
      "locLng": this.dbLocLng[k],
      "timeStamp": moment().format('MM/DD/YYYY hh:mm:ss A').toString(),
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now()
    };
     this.firebase.getMap().subscribe(snapshot => {
       snapshot.forEach(snap => {
         console.log("parking log");
         if(snap.fName == this.fName) {
           var key = snap.$key;
           this.firebase.updateParking(this.rateParkingInfo, key);
         }
       });
       if(snapshot.length == 0) {
         this.firebase.addParking(this.rateParkingInfo);
       }
     });
     this.firebase.updateParkingNotif(this.rateParkingInfo);
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
  }
}

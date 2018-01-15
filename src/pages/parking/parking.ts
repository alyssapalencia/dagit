import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {
  today = new Date();
  rateParkingInfo: any;
  parkingStatus: any;
  location: any;
  dbCategory: any[] = [];
  dbParking: any[] = [];
  dbTime: any[] = [];
  lastParking = '';
  lastTime: any;
  rating: any;

  session: any;
  dbFName: any[] = [];
  dbLName: any[] = [];
  fName: any;
  lName: any;

  date = (this.today.getMonth() + 1) + '/' + this.today.getDate() + '/' + this.today.getFullYear();
  hours = this.today.getHours() <= 12 ? this.today.getHours() : this.today.getHours() - 12;
  am_pm = this.today.getHours() >= 12 ? 'PM' : 'AM';
  hoursFormatted = this.hours < 10 ? '0' + this.hours : this.hours;
  minutes = this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes();

  time = this.hoursFormatted + ':' + this.minutes + ':' +  ' ' + this.am_pm;
  timeStamp = this.date + ' ' + this.time;


  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    console.log(moment().format('MM/DD/YYYY hh:mm:ss A').toString());
    this.parkingStatus = this.firebase.getParking();
    this.session = this.firebase.getSession();

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
    this.rateParkingInfo = {
      "category": 'Parking',
      "notifDetail": info + ' Parking: ' + 'Perdices',
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now(),
      "timeStamp": moment().format('MM/DD/YYYY hh:mm:ss A').toString()
    };
     console.log(info); 
     this.firebase.addParking(this.rateParkingInfo);
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

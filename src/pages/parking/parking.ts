import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

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
  lastParking: any;
  lastTime: any;
  rating: any;

  date = (this.today.getMonth() + 1) + '/' + this.today.getDate() + '/' + this.today.getFullYear();
  hours = this.today.getHours() <= 12 ? this.today.getHours() : this.today.getHours() - 12;
  am_pm = this.today.getHours() >= 12 ? 'PM' : 'AM';
  hoursFormatted = this.hours < 10 ? '0' + this.hours : this.hours;
  minutes = this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes();

  time = this.hoursFormatted + ':' + this.minutes + this.am_pm;
  timeStamp = this.date + ' ' + this.time;


  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    this.parkingStatus = this.firebase.getParking();

    var i = 0;
    this.parkingStatus.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbCategory[i] = snapshot.val().category;
        this.dbParking[i] = snapshot.val().notifDetail;
        this.dbTime[i] = snapshot.val().timeStamp;
        i++;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingPage');
  }

  addParking(info) {
    this.rateParkingInfo = {
      "category": 'Parking',
      "notifDetail": info + ' Parking: ' + 'Perdices',
      "timeStamp": this.timeStamp
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
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-rate-traffic',
  templateUrl: 'rate-traffic.html',
})
export class RateTrafficPage {

  today = new Date();
  rateTrafficInfo: any;
  trafficStatus: any;
  location: any;

  dbCategory: any[] = [];
  dbTraffic: any[] = [];
  dbTime: any[] = [];

  lastTraffic = "";
  lastTime: any;
  rating: any;
  test: any;

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
    this.trafficStatus = this.firebase.getRateTraffic();
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
      "notifDetail": info + ' Traffic: ' + 'Perdices',
      "timeStamp": moment().format('MM/DD/YYYY hh:mm:ss A').toString(),
      "fName": this.fName,
      "lName": this.lName,
      "sort": 0 - Date.now()
    };
     console.log(info); 
     this.firebase.addRateTraffic(this.rateTrafficInfo);
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

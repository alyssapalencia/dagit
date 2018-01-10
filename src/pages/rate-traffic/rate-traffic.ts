import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';


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

  date = (this.today.getMonth() + 1) + '/' + this.today.getDate() + '/' + this.today.getFullYear();
  hours = this.today.getHours() <= 12 ? this.today.getHours() : this.today.getHours() - 12;
  am_pm = this.today.getHours() >= 12 ? 'PM' : 'AM';
  hoursFormatted = this.hours < 10 ? '0' + this.hours : this.hours;
  minutes = this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes();

  time = this.hoursFormatted + ':' + this.minutes + ':' +  ' ' + this.am_pm;
  timeStamp = this.date + ' ' + this.time;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    this.trafficStatus = this.firebase.getRateTraffic();

    var i = 0;
    this.trafficStatus.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.dbCategory[i] = snapshot.val().category;
        this.dbTraffic[i] = snapshot.val().notifDetail;
        this.dbTime[i] = snapshot.val().timeStamp;
        i++;
      });
    });
  }

  addRateTraffic(info) {
    this.rateTrafficInfo = {
      "category": 'Traffic',
      "notifDetail": info + ' Traffic: ' + 'Perdices',
      "timeStamp": this.timeStamp
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

}

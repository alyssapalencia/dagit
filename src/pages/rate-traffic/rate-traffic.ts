import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';


@IonicPage()
@Component({
  selector: 'page-rate-traffic',
  templateUrl: 'rate-traffic.html',
})
export class RateTrafficPage {

  rateTrafficInfo: any;
  notifID = 1;
  timeStamp = Date.now();
  trafficStatus: any;
  location: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    this.trafficStatus = this.firebase.getRateTraffic();
  }

  addRateTraffic(info) {
    this.rateTrafficInfo = {
      "timeStamp": this.timeStamp,
      "location": this.location,
      "rating": info,
      "type": 'traffic'
    };
     console.log(info); 
     this.firebase.addRateTraffic(this.rateTrafficInfo);
  }

}

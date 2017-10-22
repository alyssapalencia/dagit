import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

/**
 * Generated class for the RateTrafficPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rate-traffic',
  templateUrl: 'rate-traffic.html',
})
export class RateTrafficPage {

  rateTrafficInfo: any;
  time = '11:44 AM';
  date = '10/22/2017';

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    console.log(firebase.getRateTraffic());
  }

  addRateTraffic(info) {
    this.rateTrafficInfo = {
      "status": info,
      "time": this.time,
      "date": this.date
    };
     console.log(info); 
     this.firebase.addRateTraffic(this.rateTrafficInfo);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';

@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {
  rateParkingInfo: any;
  timeStamp = Date.now();
  parkingStatus: any;
  location: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase) {
    this.parkingStatus = this.firebase.getParking();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkingPage');
  }

  addParking(info) {
    this.rateParkingInfo = {
      "timeStamp": this.timeStamp,
      "location": this.location,
      "rating": info,
      "type": 'parking'
    };
     console.log(info); 
     this.firebase.addParking(this.rateParkingInfo);
  }

}

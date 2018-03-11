/* UPDATE AS OF MARCH 11, 2018 @ 7:29AM                             *
 * Removed declare var google;                                      *
 * Removed import { Geolocation } from '@ionic-native/geolocation'; *
 * Removed private geolocation: Geolocation                         *
 * Removed import { Observable } from 'rxjs/Rx';                    */

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { FirebaseApp } from 'angularfire2';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // USER ACCOUNT
  tempuser: any;
  temppass: any;
  temp: any;
  userInfo: any;
  confirmUser: any[] = [];
  confirmPass: any[] = [];
  enabled: any[] = [];

  // LAST UPDATE
  sessionInfo: any;
  currUser: any;
  watch;
  userkey;

  constructor(public firebaseApp: FirebaseApp, public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public toastCtrl: ToastController) {
      this.userInfo = this.firebase.getUserDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // CHECK CREDENTIALS
  checkAuth(){
    var check=false;
    this.userInfo.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        if(this.tempuser == snapshot.username){
          if(this.temppass == snapshot.password){
            check = true;
            if(snapshot.enabled == "yes"){
              this.currUser = snapshot;
              this.userkey = snapshot.$key;
              this.firebase.watchUserLocation('login');
              this.addSession();
              this.firebase.setCurrentUser(snapshot);
              console.log("logged in");
              this.navCtrl.setRoot('TabsPage');
              this.navCtrl.popToRoot();
              let toast = this.toastCtrl.create({
              message: 'Login successful',
                duration: 2000,
              });
              toast.present();
            }
            else
            {
              let toast = this.toastCtrl.create({
                message: 'Account is disabled',
                  duration: 2000,
                });
                toast.present();
            }
          }
        }
      });
      if(!check){
        console.log("incorrect credentials");
        let toast = this.toastCtrl.create({
          message: 'Incorrect credentials, try again',
          duration: 2000
        });
        toast.present();
      }
    });
  }

  addSession(){
    this.sessionInfo = {
      "fName": this.currUser.fName,
      "lName": this.currUser.lName,
      "lastLogin": moment().format('MMMM Do YYYY, hh:mm A').toString(),
      "location": this.currUser.location,
      "latitude": this.currUser.locLat,
      "longitude": this.currUser.locLng
    };
    this.firebase.addSession(this.sessionInfo, this.currUser.username);
  }
}
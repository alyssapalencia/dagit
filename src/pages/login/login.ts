import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { FirebaseApp } from 'angularfire2';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

declare var google;

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

  constructor(public firebaseApp: FirebaseApp, public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public toastCtrl: ToastController, private geolocation: Geolocation) {
      this.userInfo = this.firebase.getUserDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // USER LOCATION
  watchUserLocation(uid){
    const watchOptions = {
    	enableHighAccurary: true,
    	maximumAge:5000,
    	timeout: 5000
    }
		this.watch = this.geolocation.watchPosition(watchOptions).subscribe(pos => {
			if(pos.coords != undefined){
				this.firebaseApp.database().ref("LOCATION").child(uid).update({
					lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timeStamp: moment().format('MMMM Do YYYY, hh:mm A').toString(),
          fName: this.currUser.fName,
          lName: this.currUser.lName
				});
			}
		}); 
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
              message: 'Login successful.',
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
          message: 'Incorrect credentials. Try again.',
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
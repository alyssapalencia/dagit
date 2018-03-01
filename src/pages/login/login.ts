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

  // FETCH DB
  dbFName: any[] = [];
  dbLName: any[] = [];
  dbLocation: any[] = [];
  dbLatitude: any[] = [];
  dbLongitude: any[] = [];
  dbKey: any[] = [];
  // TRACKER
  //latLng: any;
  latitude: any;
  longitude: any;

  // LAST UPDATE
  lastFName: any;
  lastLName: any;
  lastLocation: any;
  lastLatitude: any;
  lastLongitude: any;
  sessionInfo: any;
  watch;
  userkey;
  marker;
  usernode;

  constructor(public firebaseApp: FirebaseApp, public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public toastCtrl: ToastController, private geolocation: Geolocation) {
      this.userInfo = this.firebase.getUserDetail();
      var i = 0;
      this.userInfo.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.dbKey[i] = snapshot.key
          this.confirmUser[i] = snapshot.val().username;
          this.confirmPass[i] = snapshot.val().password;
          this.dbFName[i] = snapshot.val().fName;
          this.dbLName[i] = snapshot.val().lName;
          this.dbLocation[i] = snapshot.val().location;
          this.dbLatitude[i] = snapshot.val().locLat;
          this.dbLongitude[i] = snapshot.val().locLng;
          this.enabled[i] = snapshot.val().enabled;
          i++;
        });
      });
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
          fName: this.lastFName,
          lName: this.lastLName
				});
			}
		}); 
  }

  // CHECK CREDENTIALS
  checkAuth(){
    var check=false;
    for(var i=0; i<this.confirmUser.length; i++)
    {
      if(this.tempuser == this.confirmUser[i]){
        if(this.temppass == this.confirmPass[i]){
          check = true;
          if(this.enabled[i] == "yes"){
            this.userkey = this.dbKey[i];
            this.watchUserLocation(this.userkey);
            this.lastFName = this.dbFName[i];
            this.lastLName = this.dbLName[i];
            this.lastLocation = this.dbLocation[i];
            this.lastLatitude = this.dbLatitude[i];
            this.lastLongitude = this.dbLongitude[i];
            this.addSession();
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
    }
    if(!check){
      console.log("incorrect credentials");
      let toast = this.toastCtrl.create({
        message: 'Incorrect credentials. Try again.',
        duration: 2000
      });
      toast.present();
    }
  }

  addSession(){
    console.log(this.lastLocation);
    console.log(this.lastLatitude);
    console.log(this.lastLongitude);
    this.sessionInfo = {
      "fName": this.lastFName,
      "lName": this.lastLName,
      "location": this.lastLocation,
      "latitude": this.lastLatitude,
      "longitude": this.lastLongitude
    };
    this.firebase.addSession(this.sessionInfo);
  }
}
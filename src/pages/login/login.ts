import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { FirebaseApp } from 'angularfire2';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  tempuser: any;
  temppass: any;
  temp: any;
  userInfo: any;
  confirmUser: any[] = [];
  confirmPass: any[] = [];
  dbFName: any[] = [];
  dbLName: any[] = [];
  lastFName: any;
  lastLName: any;
  enabled: any[] = [];

  sessionInfo: any;

  constructor(public firebaseApp: FirebaseApp, public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public toastCtrl: ToastController, private geolocation: Geolocation) {
    //new
    this.firebaseApp.database().ref("ACCOUNTS/ON_FIELD_TMO").on('value', snapshot => {
      this.userInfo = this.firebase.getUserDetail();
      var i = 0;
      this.userInfo.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          this.confirmUser[i] = snapshot.val().username;
          this.confirmPass[i] = snapshot.val().password;
          this.dbFName[i] = snapshot.val().fName;
          this.dbLName[i] = snapshot.val().lName
          this.enabled[i] = snapshot.val().enabled;
          i++;
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  checkAuth(){
    var check=false;
    for(var i=0; i<this.confirmUser.length; i++){
      if(this.tempuser == this.confirmUser[i]){
        if(this.temppass == this.confirmPass[i]){
          check = true;
          if(this.enabled[i] == "yes"){
            this.lastFName = this.dbFName[i];
            this.lastLName = this.dbLName[i];
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
    this.sessionInfo = {
      "fName": this.lastFName,
      "lName": this.lastLName
    };
    this.firebase.addSession(this.sessionInfo);
  }
}

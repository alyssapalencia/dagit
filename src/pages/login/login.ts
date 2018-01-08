import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '../../providers/firebase';
import { ToastController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public firebase: Firebase, public toastCtrl: ToastController) {
    this.userInfo = this.firebase.getUserDetail();
    var i = 0;
    this.userInfo.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.confirmUser[i] = snapshot.val().username;
        this.confirmPass[i] = snapshot.val().password;
        i++;
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  checkAuth(){
    var check=false;

    for(var i=0; i<this.confirmUser.length; i++){
      for(var j=0; j<this.confirmPass.length; j++){
        if(this.tempuser == this.confirmUser[i]){
          if(this.temppass == this.confirmPass[j]){
            check=true;
            console.log("logged in");
            this.navCtrl.setRoot('TabsPage');
            this.navCtrl.popToRoot();

            let toast = this.toastCtrl.create({
              message: 'Login successful.',
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

}

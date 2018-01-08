import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, App } from 'ionic-angular';
import { RateTrafficPage } from '../rate-traffic/rate-traffic';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, private app: App, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

  logoutClicked() {
    console.log("Yes pressed");
    this.app.getRootNav().setRoot(LoginPage);
    let toast = this.toastCtrl.create({
      message: 'You have successfully logged out.',
      duration: 2000
    });
    toast.present();
  }
}

import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'RateTrafficPage';
  tab2Root = 'ParkingPage';
  tab3Root = 'LogoutPage';

  constructor() {

  }
}

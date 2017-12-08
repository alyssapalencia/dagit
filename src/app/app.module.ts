import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { Firebase } from './../providers/firebase';


var dagitFirebase = {
  apiKey: "AIzaSyDPsMJ-x7W6_U_k3JsNwMNkxL38e8NkQDI",
  authDomain: "dagit-7cbac.firebaseapp.com",
  databaseURL: "https://dagit-7cbac.firebaseio.com",
  projectId: "dagit-7cbac",
  storageBucket: "dagit-7cbac.appspot.com",
  messagingSenderId: "902262473533"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(dagitFirebase),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

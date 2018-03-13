import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { FirebaseApp } from 'angularfire2';
import * as moment from 'moment';

@Injectable()
export class Firebase{
    user: any;
    watch: any;

    constructor (public dagit: AngularFireDatabase, public angularFireAuth: AngularFireAuth, private geolocation: Geolocation, public firebaseApp: FirebaseApp) {
    }

    watchUserLocation(state){
        const watchOptions = {
            enableHighAccurary: true,
            maximumAge:5000,
            timeout: 5000
        }
        if(state == 'login'){
            this.watch = this.geolocation.watchPosition(watchOptions).subscribe(pos => {
                if(pos.coords != undefined){
                    console.log('tracking');
                    this.firebaseApp.database().ref("LOCATION").child(this.user.$key).update({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        timeStamp: moment().format('MMMM Do YYYY, hh:mm A').toString(),
                        fName: this.user.fName,
                        lName: this.user.lName,
                        status: 'login'
                    });
                }
            }); 
        }
        else{
            this.watch.unsubscribe();
        }
    }

    providerLogout(){
        this.dagit.object('/LOCATION/' + this.user.$key + '/status').set('logout');
    }

    setCurrentUser(user){
        this.user = user;
    }

    getCurrentUser(){
        return this.user;
    }

    // TRAFFIC 
    getMap(){
        return this.dagit.list('/MAP/');
    }

    getMaps() {
        return this.dagit.list('/MAPS/');
    }

    addRateTraffic(rateTraffic){
        this.dagit.list('/NOTIFICATIONS').push(rateTraffic);
    }

    updateRateTraffic(rateTraffic, location){
        this.dagit.object('/MAP/' + location).update(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/NOTIFICATIONS');
    }

    // PARKING
    addParking(parkingStat){
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
    }

    updateParking(parkingStat, location) {
        this.dagit.object('/MAP/' + location).update(parkingStat);
    }

    getParking(){
        return this.dagit.list('/NOTIFICATIONS');
    }

    //MAP

    updateMapData(location, update) {
        this.dagit.object('/MAP/' + location).update(update);
    }

    mapUpdateService(coordinates, update) {
        this.dagit.object('/MAPS/' + coordinates).update(update);
    }

    // USER DETAILS

    getUserDetail(){
        return this.dagit.list('/ACCOUNTS/ON_FIELD_TMO/');
    }

    addNotifLog(date, notification) {
        this.dagit.list('/LOGS/' + date).push(notification);
    }
    
    addSession(sessionInfo, username){
        this.dagit.object('/SESSIONS/' + username).update(sessionInfo);
    }

    getSession(){
        return this.dagit.list('SESSIONS');
    }

    getLocation() { 
        return this.dagit.list('LOCATION');
    }

    updateLocation(location) {
        this.dagit.object('/LOCATION/' + this.user).update(location);
    }
}
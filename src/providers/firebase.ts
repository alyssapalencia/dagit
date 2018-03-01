import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Firebase{
    user: any;

    constructor (public dagit: AngularFireDatabase, public angularFireAuth: AngularFireAuth) {
        this.user = name;
    }

    setUser(name) {
        this.user = this.angularFireAuth.auth.currentUser;
    }

    // TRAFFIC 
    addRateTraffic(rateTraffic){
        this.dagit.list('/NOTIFICATIONS').push(rateTraffic);
    }

    updateRateTraffic(rateTraffic, location){
        this.dagit.object('/MAP/' + location).update(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/NOTIFICATIONS', {
            preserveSnapshot: true
        });
    }

    // PARKING
    addParking(parkingStat){
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
    }

    updateParking(parkingStat, location) {
        this.dagit.object('/MAP/' + location).update(parkingStat);
    }

    getParking(){
        return this.dagit.list('/NOTIFICATIONS', {
            preserveSnapshot: true
        });
    }

    //MAP

    updateMapData(location, update) {
        this.dagit.object('/MAP/' + location).update(update);
    }

    // USER DETAILS

    getUserDetail(){
        return this.dagit.list('/ACCOUNTS/ON_FIELD_TMO', {
          preserveSnapshot: true
        });
    }

    addNotifLog(date, notification) {
        this.dagit.list('/LOGS/' + date).push(notification);
    }
    
    addSession(sessionInfo){
        this.dagit.list('/SESSIONS').push(sessionInfo);
    }

    getSession(){
        return this.dagit.list('SESSIONS', {
            preserveSnapshot: true
        });
    }

    updateLocation(location) {
        this.dagit.object('/LOCATION/' + this.user).update(location);
    }
}
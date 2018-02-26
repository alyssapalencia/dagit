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

    addRateTraffic(rateTraffic){
        this.dagit.list('/NOTIFICATIONS').push(rateTraffic);
        this.dagit.list('/MAP').push(rateTraffic);
    }

    updateRateTraffic(rateTraffic, key){
        this.dagit.list('/NOTIFICATIONS').push(rateTraffic);
        this.dagit.object('/MAP/' + key).update(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/NOTIFICATIONS', {
            preserveSnapshot: true
        });
    }

    getMap() {
        return this.dagit.list('/MAP');
    }

    addParking(parkingStat){
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
        this.dagit.list('/MAP').push(parkingStat);
    }

    updateParking(parkingStat, key) {
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
        this.dagit.object('/MAP/' + key).update(parkingStat);
    }

    getParking(){
        return this.dagit.list('/NOTIFICATIONS', {
            preserveSnapshot: true
        });
    }

    getUserDetail(){
        return this.dagit.list('/ACCOUNTS/ON_FIELD_TMO', {
          preserveSnapshot: true
        });
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
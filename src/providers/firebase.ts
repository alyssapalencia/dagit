import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Firebase{
    user: any;

    constructor (public dagit: AngularFireDatabase) {
        this.user = "Kurt Torregosa";
    }

    addRateTraffic(rateTraffic){
        this.dagit.list('/NOTIFICATIONS').push(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/NOTIFICATIONS', {
            preserveSnapshot: true
        });
    }

    addParking(parkingStat){
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
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
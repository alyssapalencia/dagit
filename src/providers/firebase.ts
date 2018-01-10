import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Firebase{
    
    constructor (public dagit: AngularFireDatabase) {
        
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
}
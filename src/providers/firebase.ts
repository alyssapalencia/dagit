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
        return this.dagit.list('/NOTIFICATIONS');
    }

    addParking(parkingStat){
        this.dagit.list('/NOTIFICATIONS').push(parkingStat);
    }

    getParking(){
        return this.dagit.list('/NOTIFICATIONS');
    }

    public getLastToken(): FirebaseListObservable<any[]>{
        return this.dagit.list('/NOTIFICATIONS',{
            query:{
                limitToLast:1
            }
        });
    }
}
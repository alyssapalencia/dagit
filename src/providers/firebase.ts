import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Firebase{
    
    constructor (public dagit: AngularFireDatabase) {
        
    }

    addRateTraffic(rateTraffic){
        this.dagit.list('/notification').push(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/notification');
    }

    addParking(parkingStat){
        this.dagit.list('/notification').push(parkingStat);
    }

    getParking(){
        return this.dagit.list('/notification');
    }

    public getLastToken(): FirebaseListObservable<any[]>{
        return this.dagit.list('/notifications',{
            query:{
                limitToLast:1
            }
        });
    }
}
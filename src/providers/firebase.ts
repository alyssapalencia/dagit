import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Firebase{
    
    constructor (public dagit: AngularFireDatabase) {
        
    }

    addRateTraffic(rateTraffic){
        this.dagit.list('/NOTIFICATION').push(rateTraffic);
    }

    getRateTraffic(){
        return this.dagit.list('/NOTIFICATION');
    }

    addParking(parkingStat){
        this.dagit.list('/NOTIFICATION').push(parkingStat);
    }

    getParking(){
        return this.dagit.list('/NOTIFICATION');
    }

    public getLastToken(): FirebaseListObservable<any[]>{
        return this.dagit.list('/NOTIFICATION',{
            query:{
                limitToLast:1
            }
        });
    }
}
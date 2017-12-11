import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';

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
}
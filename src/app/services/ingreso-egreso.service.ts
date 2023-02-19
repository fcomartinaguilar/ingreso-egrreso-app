import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class IngresoEgresoService{

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService
    ) { }

    crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
        console.log('crearIngresoEgreso--> ', ingresoEgreso);
        const uid = this.authService.user.uid;
        delete ingresoEgreso.uid;
        return this.firestore.doc(`${uid}/ingreso-egreso`)
            .collection('items')
            .add({...ingresoEgreso});
    }

    initIngresosEgresosListener(uid: string) {
        console.log ('juan-->', uid)
        return this.firestore.collection(`${uid}/ingresos-egresos/items`)
            .snapshotChanges()
            .pipe(
                map( snapshot => {
                    console.log ('snapshot--> ', snapshot)
                    return snapshot.map( doc => {
                        // const data:any = doc.payload.doc.data();
                        return {
                            uid: doc.payload.doc.id,
                            // ...data
                            ...doc.payload.doc.data() as any
                        }
                    })
                })
            );
    }

    borrarIngresoEgreso( uidItem: string | undefined ) {
        const uid = this.authService.user.uid;
        return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
    }
}

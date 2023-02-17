import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        public auth: AngularFireAuth,
        private firestore: AngularFirestore
    ) { }

    crearUsuario( nombre:string, email:string, password:string ) {
        return this.auth.createUserWithEmailAndPassword( email, password ) // regresa una promesa
            .then( ({user}) => {
                const newUser = new Usuario( user?.uid!, nombre, user?.email! );

                return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser});
            });
    }

    loginUsuario( email:string, password:string ) {
        return this.auth.signInWithEmailAndPassword( email, password ); // regresa una promesa
    }

    logout() {
        return this.auth.signOut();
    }

    initAuthListener() {
        this.auth.onAuthStateChanged(firebaseUser => {
            console.log(firebaseUser);
        });
    }

    isAuth() {
        return this.auth.authState.pipe(
            map( fbUser => fbUser != null )
        );
    }
}

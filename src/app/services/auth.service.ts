import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subject, takeUntil } from 'rxjs';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy{

    userSubscription = new Subject();
    private _user!: Usuario | null;

    get user() {
      return ({...this._user});
    }

    constructor(
        public auth: AngularFireAuth,
        private firestore: AngularFirestore,
        private store: Store<AppState>
    ) { }

    ngOnDestroy(): void {
      this.userSubscription.next('');
      this.userSubscription.complete();
    }

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
        this.auth.onAuthStateChanged(fbUser => {
            // console.log(fbUser?.uid);
            if (fbUser) {
              // Existe
              this.firestore.doc(`${fbUser.uid}/usuario`).valueChanges().pipe(
                takeUntil(this.userSubscription)
              )
                .subscribe( (firestoreUser: any) => {
                  console.log ('initAuthListener --->', firestoreUser);
                  const user = Usuario.fromFirebase( firestoreUser );
                  this._user = user;
                  this.store.dispatch(authActions.setUser({ user: user }));
                })
              }
              else {
                // No Existe
                console.log ('Llamar unset del user');
                this._user = null;
                this.store.dispatch(authActions.unSetUser());
                this.store.dispatch(ingresoEgresoActions.unSetItems());
            }
        });
    }

    isAuth() {
        return this.auth.authState.pipe(
            map( fbUser => fbUser != null )
        );
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy{

    userSubscription = new Subject();
    ingresosSubscription = new Subject();

    constructor(
        private store: Store<AppState>,
        private ingresoEgresoService: IngresoEgresoService
    ){}

    ngOnInit(): void {
        this.store.select('user').pipe(
            takeUntil(this.userSubscription),
            filter( auth => auth.user != null )
        )
        .subscribe( ({user}) => {
            console.log('init Dashboard -->', user);
            this.ingresoEgresoService.initIngresosEgresosListener(user!?.uid).pipe(
                takeUntil(this.ingresosSubscription)
            )
                .subscribe( ingresosEgresosFB => {
                    console.log ('ingresosEgresosFB-->', ingresosEgresosFB);
                    this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}))
                });
        });
    }

    ngOnDestroy(): void {
        this.userSubscription.next('');
        this.userSubscription.complete();
        this.ingresosSubscription.next('');
        this.ingresosSubscription.complete();
    }
}

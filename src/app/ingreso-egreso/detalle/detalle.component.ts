import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit, OnDestroy{

    ingresosEgresos: IngresoEgreso[] = [];
    ingresoSubscription = new Subject();

    constructor(
        private ingresoEgresoService: IngresoEgresoService,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.store.select('ingresosEgresos').pipe(
            takeUntil(this.ingresoSubscription)
        ).subscribe( ({items}) => {
            console.log('items--> ', items);
            this.ingresosEgresos = items;
        })
    }

    ngOnDestroy(): void {
        this.ingresoSubscription.next('');
        this.ingresoSubscription.complete();
    }

    borrar(uid: string | undefined) {
        this.ingresoEgresoService.borrarIngresoEgreso(uid)
            .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
            .catch( err => Swal.fire('Error', err.message, 'error'))
    }
}

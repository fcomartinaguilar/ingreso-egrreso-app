import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';

@Component({
    selector: 'app-ingreso-egreso',
    templateUrl: './ingreso-egreso.component.html'
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

    ingresoForm!: FormGroup;
    tipo: string = 'ingreso';
    cargando: boolean = false;
    loadingSubscription = new Subject();

    constructor(
        private fb: FormBuilder,
        private ingresoEgresoService: IngresoEgresoService,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.ingresoForm = this.fb.group({
            descripcion: ['', Validators.required],
            monto: ['', Validators.required],
        });

        this.store.select('ui').pipe(
            takeUntil(this.loadingSubscription)
        )
        // .subscribe( (ui) => this.cargando = ui.isLoading ); --> Es otra forma de hacerlo
        .subscribe( ({isLoading}) => this.cargando = isLoading );
    }

    ngOnDestroy(): void {
        this.loadingSubscription.next('');
        this.loadingSubscription.complete();
    }

    guardar() {
        if (this.ingresoForm.invalid) { return; }

        this.store.dispatch(ui.isLoading());

        const {descripcion, monto} = this.ingresoForm.value;
        const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

        this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
            .then( (ref) => {
                console.log ('exito: ', ref);
                this.store.dispatch(ui.stopLoading());
                this.ingresoForm.reset();
                Swal.fire('Registro creado', descripcion, 'success');
            })
            .catch( err => {
                this.store.dispatch(ui.stopLoading());
                console.warn(err);
                Swal.fire('Error', err.message, 'error');
            } );

    }

}

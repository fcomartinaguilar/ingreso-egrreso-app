import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy{

    registroForm!: FormGroup;
    cargando: boolean = false;
    uiSubscription = new Subject();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>,
    ) {

    }

    ngOnInit(): void {
        this.registroForm = this.fb.group({
            nombre: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        this.store.select('ui').pipe(
          takeUntil(this.uiSubscription)
        ).subscribe( ui => {
          this.cargando = ui.isLoading;
          console.log ('cargando subs');
        });
    }

    ngOnDestroy(): void {
      this.uiSubscription.next('');
      this.uiSubscription.complete();
    }

    crearUsuario() {
        if(this.registroForm.invalid) {
            return;
        }

        this.store.dispatch(ui.isLoading());

        // Swal.fire({
        //     title: 'Espere por favor',
        //     didOpen: () => {
        //         Swal.showLoading()
        //     }
        // });

        const {nombre, email, password} = this.registroForm.value;
        this.authService.crearUsuario(nombre, email, password).then(
            credenciales => {
                console.log('Credenciales Crear Usuario -->', credenciales);
                // Swal.close();
                this.store.dispatch(ui.stopLoading());
                this.router.navigate(['/']);
            }
        ).catch(err => {
          this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })});
    }

}

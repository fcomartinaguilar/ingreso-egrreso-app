import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy{

    loginForm!: FormGroup;
    cargando: boolean = false;
    // uiSubscription: Subscription;
    uiSubscription = new Subject();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>,
    ) {

    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });

        this.store.select('ui').pipe(
          takeUntil(this.uiSubscription)
        ).subscribe( ui => {
          this.cargando = ui.isLoading;
          console.log ('cargando subs');
        });
    }

    ngOnDestroy(): void {
      // this.uiSubscription.unsubscribe();
      this.uiSubscription.next('');
      this.uiSubscription.complete();
    }

    loginUsuario() {
        if(this.loginForm.invalid) {
            return;
        }

        this.store.dispatch(ui.isLoading());

        // Swal.fire({
        //     title: 'Espere por favor',
        //     didOpen: () => {
        //         Swal.showLoading()
        //     }
        // });

        const {email, password} = this.loginForm.value;
        this.authService.loginUsuario(email, password).then(
            credenciales => {
                console.log('Credenciales Login Usuario -->', credenciales);
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

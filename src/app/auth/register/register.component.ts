import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{

    registroForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.registroForm = this.fb.group({
            nombre: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    crearUsuario() {
        if(this.registroForm.invalid) {
            return;
        }

        Swal.fire({
            title: 'Espere por favor',
            didOpen: () => {
                Swal.showLoading()
            }
        });

        const {nombre, email, password} = this.registroForm.value;
        this.authService.crearUsuario(nombre, email, password).then(
            credenciales => {
                console.log('Credenciales Crear Usuario -->', credenciales);
                Swal.close();
                this.router.navigate(['/']);
            }
        ).catch(err => Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          }));
    }

}

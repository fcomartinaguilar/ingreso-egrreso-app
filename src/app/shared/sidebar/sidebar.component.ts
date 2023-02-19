import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../app.reducer';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {

    cancelSubcriptions = new Subject();
    nombre: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.store.select('user').pipe(
            takeUntil(this.cancelSubcriptions),
            filter( ({user}) => user != null )
        ).subscribe( ({user}) => this.nombre = user!.nombre)
    }

    ngOnDestroy(): void {
        this.cancelSubcriptions.next('');
        this.cancelSubcriptions.complete();
    }

    logout() {
        this.authService.logout().then(
            () => this.router.navigate(['/login'])
        );
    }
}

import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {

    constructor(
        private authService: AuthService,
        private router: Router ) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuth().pipe(
            tap( estado => {
                if (!estado) {
                    this.router.navigate(['/login']);
                }
            })
        );
    }

    canMatch(): Observable<boolean> {
      return this.authService.isAuth().pipe(
          tap( estado => {
              if (!estado) {
                  this.router.navigate(['/login']);
              }
          }),
          take(1)
      );
  }

}

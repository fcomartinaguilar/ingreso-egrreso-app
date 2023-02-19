import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';

const rutasHijas: Routes = [
  {
      path: '',
      component: DashboardComponent,
      children: dashboardRoutes,
      // canActivate: [AuthGuard]
    },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rutasHijas)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }

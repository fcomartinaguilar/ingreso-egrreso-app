import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppState } from '../../app.reducer';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
    selector: 'app-estadistica',
    templateUrl: './estadistica.component.html'
})
export class EstadisticaComponent implements OnInit, OnDestroy{

    ingresos: number = 0;
    egresos: number = 0;
    totalIngresos: number = 0;
    totalEgresos: number = 0;

    cancelSubcription = new Subject();

    // Doughnut
    public doughnutChartLabels: string[] = [ 'Ingreso', 'Egreso' ];
    public doughnutChartData: ChartData<'doughnut'> = {
        labels: this.doughnutChartLabels,
        datasets: [
            { data: [this.totalIngresos, this.totalEgresos] },
        ]
    };
    public doughnutChartType: ChartType = 'doughnut';

    // events
    public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
        console.log(event, active);
    }

    constructor(
        private store: Store<AppState>
    ){}

    ngOnInit(): void {
        this.store.select('ingresosEgresos').pipe(
            takeUntil(this.cancelSubcription)
        ).subscribe( ({items}) => {
            this.generarEstadistica(items)
        });
    }

    ngOnDestroy(): void {
        this.cancelSubcription.next('');
        this.cancelSubcription.complete();
    }

    generarEstadistica(items: IngresoEgreso[]) {
        this.totalEgresos = 0;
        this.totalIngresos = 0;
        this.egresos = 0;
        this.ingresos = 0;
        for (const item of items) {
            if(item.tipo === 'ingreso') {
                this.totalIngresos +=item.monto;
                this.ingresos ++;
            }
            else {
                this.totalEgresos +=item.monto;
                this.egresos ++;
            }
        }
    }
}

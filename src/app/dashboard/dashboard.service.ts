import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface DashboardState {
    world: any; //for trend chart's map
    ncov: any; //for ncov data
    dataTypeSelected: String;// confirmed, deaths or recovered
    countrySelected: String;// Taiwan, Japan or....
    dateSelected: String;// confirmed, deaths or recovered
    trend_ncov: [];
    line_ncov: [];
    loading: boolean;     
}

let _state: DashboardState = {
    world: [],
    ncov: [],
    dataTypeSelected: 'confirmed',
    countrySelected: 'world',
    dateSelected: null,
    trend_ncov: [],
    line_ncov: [],
    loading: false
};

@Injectable()
export class DashboardService {
    
    private store = new BehaviorSubject<DashboardState>(_state);
    private state$ = this.store.asObservable();

    world$ = this.state$.pipe(map(state => state.world), distinctUntilChanged());
    ncov$ = this.state$.pipe(map(state => state.ncov), distinctUntilChanged());
    dataTypeSelected$ = this.state$.pipe(map(state => state.dataTypeSelected), distinctUntilChanged());
    countrySelected$ = this.state$.pipe(map(state => state.countrySelected), distinctUntilChanged());
    dateSelected$ = this.state$.pipe(map(state => state.dateSelected), distinctUntilChanged());
    trend_ncov$ = this.state$.pipe(map(state => state.trend_ncov), distinctUntilChanged());
    line_ncov$ = this.state$.pipe(map(state => state.line_ncov), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    vm$: Observable<DashboardState> = combineLatest(
            this.world$, this.ncov$, this.dataTypeSelected$, 
            this.countrySelected$, this.dateSelected$, 
            this.trend_ncov$, this.line_ncov$, this.loading$)
        .pipe(
            map(([world, ncov, dataTypeSelected, countrySelected, dateSelected, trend_ncov, line_ncov, loading]) => {
                return {world, ncov, dataTypeSelected, countrySelected, dateSelected, trend_ncov, line_ncov, loading};
            })
        )


    constructor(private http: HttpClient) {
        combineLatest(this.world$, this.ncov$, this.dataTypeSelected$, this.countrySelected$, this.dateSelected$).pipe(
            switchMap(([ncov, dataTypeSelected, countrySelected, dateSelected]) => {
                return this.getChartData(ncov, dataTypeSelected, countrySelected, dateSelected);
            })
        ).subscribe((chartData: any) => {
            let {trend_ncov, line_ncov} = chartData;
            this.updateState({..._state,trend_ncov, line_ncov, loading: false});
        })
    }

    private getChartData(ncov, dataTypeSelected, countrySelected, dateSelected) {

    }
    private updateState(state: DashboardState) {
        this.store.next(_state = state);
    }
}
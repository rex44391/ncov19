import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

export interface DashboardState {
    world: any; //for trend chart's map
    ncov: any; //for ncov data
    maxDate: number;
    dataTypeSelected: string;// confirmed, deaths or recovered
    countrySelected: string;// Taiwan, Japan or....
    dateSelected: number;// confirmed, deaths or recovered
    trend_ncov: any;
    line_ncov: any[];
    loading: boolean;
}

let _state: DashboardState = {
    world: [],
    ncov: [],
    maxDate: 0,
    dataTypeSelected: 'confirmed',
    countrySelected: 'World',
    dateSelected: null,
    trend_ncov: {},
    line_ncov: [],
    loading: false
};

@Injectable()
export class DashboardService {

    private countryNameTable = {
        'Taiwan*': 'Taiwan',//name of ncov, name of world
        'Czechia': 'Czech Rep.',
        'US': 'United States',
        'Korea, South': 'Korea',
        'Bosnia and Herzegovina': 'Bosnia and Herz.',
        'Laos': 'Lao PDR',
        'Burma': 'Myanmar',
        'Congo (Kinshasa)': 'Dem. Rep. Congo',
        'Congo (Brazzaville)': 'Congo',
        'Central African Republic': 'Central African Rep.',
        'Dominican Republic': 'Dominican Rep.',
        'North Macedonia' : 'Macedonia',
        "Cote d'Ivoire" : "CÃ´te d'Ivoire",
    };

    private store = new BehaviorSubject<DashboardState>(_state);
    private state$ = this.store.asObservable();

    world$ = this.state$.pipe(map(state => state.world), distinctUntilChanged());
    ncov$ = this.state$.pipe(map(state => state.ncov), distinctUntilChanged());
    maxDate$ = this.state$.pipe(map(state => state.maxDate), distinctUntilChanged())
    dataTypeSelected$ = this.state$.pipe(map(state => state.dataTypeSelected), distinctUntilChanged());
    countrySelected$ = this.state$.pipe(map(state => state.countrySelected), distinctUntilChanged());
    dateSelected$ = this.state$.pipe(map(state => state.dateSelected), distinctUntilChanged());
    trend_ncov$ = this.state$.pipe(map(state => state.trend_ncov), distinctUntilChanged());
    line_ncov$ = this.state$.pipe(map(state => state.line_ncov), distinctUntilChanged());
    loading$ = this.state$.pipe(map(state => state.loading));

    vm$: Observable<DashboardState> = combineLatest(
        this.world$, this.ncov$, this.maxDate$, this.dataTypeSelected$,
        this.countrySelected$, this.dateSelected$,
        this.trend_ncov$, this.line_ncov$, this.loading$)
        .pipe(
            map(([world, ncov, maxDate, dataTypeSelected, countrySelected, dateSelected, trend_ncov, line_ncov, loading]) => {
                return { world, ncov, maxDate, dataTypeSelected, countrySelected, dateSelected, trend_ncov, line_ncov, loading };
            })
        )


    constructor(private http: HttpClient) {
        let worldApi$ = this.getWorldApi();
        let ncovApi$ = this.getNcovApi();

        //get data first time
        combineLatest(worldApi$, ncovApi$)
            .subscribe(([world, ncov]) => {
                //sync country name with the world
                for (let key in this.countryNameTable) {
                    ncov[this.countryNameTable[key]] = ncov[key];
                    delete ncov[key];
                }
                let tempArr = [];
                for (let country in ncov) {
                    for (let i = 0; i < ncov[country].length; i++) {
                        ncov[country][i]['date'] = d3.timeFormat('%Y-%m-%d')(d3.timeParse('%Y-%m-%d')(ncov[country][i]['date']));
                        if (tempArr.length <= i) {
                            let obj = { ...ncov[country][i] };
                            tempArr.push(obj);
                        } else {
                            tempArr[i]['confirmed'] += ncov[country][i]['confirmed'];
                            tempArr[i]['deaths'] += ncov[country][i]['deaths'];
                            tempArr[i]['recovered'] += ncov[country][i]['recovered'];
                        }
                    }
                }


                ncov['World'] = tempArr;
                let maxDate = ncov['World'].length - 1;
                let dateSelected = 0;
                let countrySelected = 'World';
                let line_ncov = [];

                for (let i = 0; i <= maxDate; i++) {
                    line_ncov.push({ ...ncov[countrySelected][i] });
                }

                let trend_ncov = {};

                for (let country in ncov) {
                    trend_ncov[country] = [];
                    trend_ncov[country].push({ ...ncov[country][dateSelected] });
                }

                this.updateState({ ..._state, world, ncov, maxDate, dateSelected, countrySelected, trend_ncov, line_ncov, loading: false });
            });


    }

    getStateSnapshot(): DashboardState {
        return { ..._state };
    }

    updateCountrySelected(countrySelected: string) {
        let line_ncov = [];
        if (_state.ncov[countrySelected]) {
            for (let i = 0; i <= _state.dateSelected; i++) {
                line_ncov.push({ ..._state.ncov[countrySelected][i] });
            }
        }
        this.updateState({ ..._state, countrySelected, line_ncov, loading: false });
    }

    updateDateSelected(dateSelected: number) {
        let trend_ncov = {};
        for (let country in _state.ncov) {
            trend_ncov[country] = [];
            trend_ncov[country].push({ ..._state.ncov[country][dateSelected] });
        }
        let line_ncov = [];
        if (_state.ncov[_state.countrySelected]) {
            for (let i = 0; i <= dateSelected; i++) {
                line_ncov.push({ ..._state.ncov[_state.countrySelected][i] });
            }
        }
        this.updateState({ ..._state, dateSelected, line_ncov, trend_ncov, loading: false });
    }

    updateDataTypeSelected(dataTypeSelected: string) {
        this.updateState({..._state, dataTypeSelected, loading: false});
    }

    private updateState(state: DashboardState) {
        this.store.next(_state = state);
    }

    private getWorldApi() {
        return this.http.get<any>('https://gist.githubusercontent.com/MaciejKus/61e9ff1591355b00c1c1caf31e76a668/raw/4a5d012dc2df1aae1c36e2fdd414c21824329452/combined2.json');
    }

    private getNcovApi() {
        return this.http.get<any>('https://pomber.github.io/covid19/timeseries.json');
    }
}
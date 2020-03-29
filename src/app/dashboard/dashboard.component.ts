import { Component } from '@angular/core';
import { DataModel } from '../data/data.model';
import { Observable, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    // data: Observable<DataModel>;
    trendData;
    countryNameTable = {
        'Taiwan*': 'Taiwan',
        'Czechia': 'Czechia',
        'US': 'United States',
        'Korea, South': 'Korea',
        'Bosnia and Herzegovina': 'Bosnia and Herz.'
    };
    constructor(private httpClient: HttpClient) {
        // this.data = this.httpClient.get<DataModel>('assets/data.json');



        let world$ = this.httpClient.get('https://gist.githubusercontent.com/MaciejKus/61e9ff1591355b00c1c1caf31e76a668/raw/4a5d012dc2df1aae1c36e2fdd414c21824329452/combined2.json');
        let ncov$ = this.httpClient.get('https://pomber.github.io/covid19/timeseries.json');
        combineLatest(world$, ncov$).pipe(
            map(([world, ncov]) => {
                return { world, ncov };
            })
        ).subscribe(({ world, ncov }) => {
            for (let key in this.countryNameTable) {
                ncov[this.countryNameTable[key]] = ncov[key];
                delete ncov[key];
            }
            this.trendData = {world, ncov};
        })
    }
}
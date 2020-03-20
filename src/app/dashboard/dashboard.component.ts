import { Component } from '@angular/core';
import { DataModel } from '../data/data.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    data: Observable<DataModel>;

    constructor(private http: HttpClient) {
        this.data = this.http.get<DataModel>('assets/data.json');
    }
}
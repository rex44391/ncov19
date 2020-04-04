import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService, DashboardState } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    
    vm$: Observable<DashboardState> = this.dbService.vm$;
    
    dateSelectedString = '';
    confirmed_plus = 0;
    deaths_plus = 0;
    recovered_plus = 0;

    constructor(private dbService: DashboardService) {
        // setTimeout(() => {
        //     this.dbService.updateCountrySelected('Taiwan');
        //     this.dbService.updateDateSelected(40);
        //     this.dbService.updateDataTypeSelected('deaths');
        // }, 4000);
        this.vm$.subscribe(vm => {
            if(vm.line_ncov && vm.dateSelected > 0 && vm.line_ncov[vm.dateSelected]) {
                this.dateSelectedString = vm.line_ncov[vm.dateSelected].date;
                this.confirmed_plus = vm.line_ncov[vm.dateSelected].confirmed - vm.line_ncov[vm.dateSelected - 1].confirmed;
                this.deaths_plus = vm.line_ncov[vm.dateSelected].deaths - vm.line_ncov[vm.dateSelected - 1].deaths;
                this.recovered_plus = vm.line_ncov[vm.dateSelected].recovered - vm.line_ncov[vm.dateSelected - 1].recovered;
            } else {
                this.dateSelectedString = '2020-01-22';
                this.confirmed_plus = 0;
                this.deaths_plus = 0;
                this.recovered_plus = 0;
            }
        });
    }

    onSelectCountry(e) {
        this.dbService.updateCountrySelected(e);
    }
    onSelectDataType(e) {
        this.dbService.updateDataTypeSelected(e);
    }
    onSelectDate(e) {
        this.dbService.updateDateSelected(e);
    }
}
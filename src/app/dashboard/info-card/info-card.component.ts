import { Component, OnChanges, Input } from '@angular/core';

@Component({
    selector: 'app-info-card',
    templateUrl: './info-card.component.html',
    styleUrls: ['./info-card.component.css'],
})
export class InfoCardComponent implements OnChanges {
    @Input() countrySelected;
    @Input() dateSelectedString;
    @Input() confirmed;
    @Input() deaths;
    @Input() recovered;
    @Input() confirmed_plus = 0;
    @Input() deaths_plus = 0;
    @Input() recovered_plus = 0;
    ngOnChanges() {}
}
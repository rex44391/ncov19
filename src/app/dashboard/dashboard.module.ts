import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ThirdPartyModule } from '../thirdparty.module';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        DashboardRoutingModule,
        ThirdPartyModule
    ],
    declarations: [
        DashboardComponent,
        TrendChartComponent
    ],
    providers: []
})
export class DashboardModule {}
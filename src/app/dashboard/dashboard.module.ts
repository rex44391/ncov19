import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ThirdPartyModule } from '../thirdparty.module';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        DashboardRoutingModule,
        ThirdPartyModule
    ],
    declarations: [
        DashboardComponent,
        TrendChartComponent,
        LineChartComponent
    ],
    providers: []
})
export class DashboardModule {}
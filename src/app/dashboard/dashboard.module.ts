import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ThirdPartyModule } from '../thirdparty.module';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { InfoCardComponent } from './info-card/info-card.component';
import { DashboardService } from './dashboard.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        DashboardRoutingModule,
        FormsModule,
        ThirdPartyModule
    ],
    declarations: [
        DashboardComponent,
        TrendChartComponent,
        LineChartComponent,
        ControlPanelComponent,
        InfoCardComponent
    ],
    providers: [
        DashboardService
    ]
})
export class DashboardModule {}
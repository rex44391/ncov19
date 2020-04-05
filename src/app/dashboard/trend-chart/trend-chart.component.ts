import { Component, ViewChild, ElementRef, OnChanges, Input, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import * as d3 from 'd3';
import { feature } from 'topojson';

@Component({
    selector: 'app-trend-chart',
    templateUrl: './trend-chart.component.html',
    styleUrls: ['./trend-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TrendChartComponent implements OnChanges {
    @ViewChild('chart') private chartContainer: ElementRef;

    @Input() world: any;
    @Input() trendData: any;
    @Input() dataTypeSelected: string;
    @Output() selectCountry: EventEmitter<string> = new EventEmitter<string>()
    chartObj: any;

    constructor() { }
    ngOnChanges() {
        if (!this.chartContainer || !this.world || !this.world.objects || !this.world.objects.countries || !this.trendData || !this.dataTypeSelected) { return; }
        if (!this.chartObj) {
            this.chartObj = this.createChart();
        } else {
            this.updateChart();
        }
    }
    


    private updateChart() {
        this.chartObj.g.g
            .on('mousemove', this.chartObj.tooltipClosure(this.trendData))
            .transition()
            .duration(400)
            .style('fill', this.chartObj.colorClosure(this.trendData, this.dataTypeSelected))
    }

    private createChart(): any {
        const chartObj: any = {}
        chartObj.element = this.chartContainer.nativeElement;


        chartObj.width = 962;
        chartObj.height = 502;


        // let usa, canada;
        // let states;

        chartObj.initX;
        chartObj.mouseClicked = false;
        chartObj.s = 1;
        chartObj.rotated = 90;

        chartObj.mouse;

        chartObj.offsetL = document.getElementById('map').offsetLeft + 10;
        chartObj.offsetT = document.getElementById('map').offsetTop + 10;
        chartObj.tooltip = d3.select('#map')
            .append('div')
            .attr('class', 'tooptip hidden');

        chartObj.projection = d3.geoMercator()
            .scale(153)
            .translate([chartObj.width / 2, chartObj.height / 1.5])
            .rotate([chartObj.rotated, 0, 0])

        chartObj.path = d3.geoPath().projection(chartObj.projection);

        chartObj.zoomended = function() {
            if (chartObj.s !== 1) return;
            if (chartObj.mouse) {
                chartObj.rotated = chartObj.rotated + ((chartObj.mouse[0] - chartObj.initX) * 360 / (chartObj.s * chartObj.width));
                chartObj.mouseClicked = false;
            }
        }

        chartObj.zoomed = function() {
            let t = [d3.event.transform.x, d3.event.transform.y];
            chartObj.s = d3.event.transform.k;
            let h = 0;

            t[0] = Math.min(
                (chartObj.width / chartObj.height) * (chartObj.s - 1),
                Math.max(chartObj.width * (1 - chartObj.s), t[0])
            );

            t[1] = Math.min(
                h * (chartObj.s - 1) + h * chartObj.s,
                Math.max(chartObj.height * (1 - chartObj.s) - h * chartObj.s, t[1])
            );

            chartObj.g.attr("transform", "translate(" + t + ")scale(" + chartObj.s + ")");

            // d3.selectAll(".boundary").style("stroke-width", 1 / s);

            chartObj.mouse = d3.mouse(this);

            if (chartObj.s === 1 && chartObj.mouseClicked) {
                chartObj.rotateMap(chartObj.mouse[0]);
                return;
            }
            // if (s > 1.5) {
            //     states
            //         .classed('hidden', false);
            //     usa
            //         .classed('hidden', true);
            //     canada
            //         .classed('hidden', true);
            // } else {
            //     states
            //         .classed('hidden', true);
            //     usa
            //         .classed('hidden', false);
            //     canada
            //         .classed('hidden', false);
            // }
        }

        chartObj.zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on('zoom', chartObj.zoomed)
            .on('end', chartObj.zoomended);

        chartObj.svg = d3.select(chartObj.element).append('svg')
            .attr('width', chartObj.element.offsetWidth)
            .attr('height', chartObj.element.offsetHeight)
            .on("wheel", function () {
                chartObj.initX = d3.mouse(this)[0];
            })
            .on("mousedown", function (d) {
                d3.event.preventDefault();
                if (chartObj.s !== 1) return;
                chartObj.initX = d3.mouse(this)[0];
                chartObj.mouseClicked = true;
            })
            .call(chartObj.zoom);

        chartObj.g = chartObj.svg.append('g');

        chartObj.rotateMap = function(endX) {
            chartObj.projection.rotate([chartObj.rotated + (endX - chartObj.initX) * 360 / (chartObj.s * chartObj.width), 0, 0]);
            chartObj.g.selectAll('path').attr('d', chartObj.path);
        }


        chartObj.tooltipClosure = function(ncovData: any) {
            return (d: any) => {
                let confirmed = 'unknown';
                let deaths = 'unknown';
                let recovered = 'unknown';
                if (ncovData[d.properties.name]) {
                    let dataTemp = ncovData[d.properties.name][ncovData[d.properties.name].length - 1];
                    confirmed = dataTemp.confirmed;
                    deaths = dataTemp.deaths;
                    recovered = dataTemp.recovered;
                }

                let label = `
                    <b>${d.properties.name}</b><br>
                    confirmed: ${confirmed}<br>
                    death: ${deaths}<br>
                    recovered: ${recovered}
                `;
                let mouse = d3.mouse(chartObj.svg.node())
                    .map(function (d: any) { return parseInt(d); });
                chartObj.tooltip.classed('hidden', false)
                    .attr('style', `
                        left: ${mouse[0] + chartObj.offsetL}px;
                        top: ${mouse[1] + chartObj.offsetT}px;
                        color: #222;
                        background: #fff;
                        border-radius: 3px;
                        font-family:"avenir next", Arial, sans-serif;
                        box-shadow: 0px 0px 2px 0px #a6a6a6; 
                        padding: .2em; 
                        text-shadow: #f5f5f5 0 1px 0;
                        opacity: 0.8;
                        position: absolute;
                    `)
                    .html(label);

            }
        }

        chartObj.selected = function(d) {
            d3.select('.selected').classed('selected', false);
            d3.select(this).classed('selected', true);
        }
        chartObj.selectedClosure = function(countryEmitter) {
            return (d) => {
                countryEmitter.emit(d.properties.name);
                d3.select('.selected').classed('selected', false);
                d3.select(`#${d.id}`).classed('selected', true);
            }
        }

        chartObj.colorClosure = function(ncovData: any, dataTypeSelected: string) {
            const colorPallete = {
                confirmed: d3.schemeReds[9],
                deaths: d3.schemeGreys[9],
                recovered: d3.schemeBlues[9],
            }
            return (d: any) => {
                let countryName = d.properties.name;
                let color = colorPallete[dataTypeSelected];
                if(ncovData && ncovData[countryName]) {
                    let dataNumber = ncovData[countryName][0][dataTypeSelected];
                    switch (true) {
                        case (dataNumber === 0):
                            return color[0];
                        case (dataNumber < 100):
                            return color[1];
                        case (dataNumber < 500):
                            return color[2];
                        case (dataNumber < 1000):
                            return color[3];
                        case (dataNumber < 5000):
                            return color[4];
                        case (dataNumber < 10000):
                            return color[5];
                        case (dataNumber < 100000):
                            return color[6];
                        case (dataNumber < 1000000):
                            return color[7];
                        default:
                            return color[8];
                }
                } else {
                    // console.log(ncovData);
                    // console.log(countryName);
                }
                return '#FFFFFF';

            }
        }

        let mapFeatures: any = (feature(this.world as any, (this.world as any).objects.countries));
        chartObj.g.g = chartObj.g.append('g')
            .attr('class', 'boundary')
            .selectAll('boundary')
            .data(mapFeatures.features)
            .enter().append('path')
            .attr('d', chartObj.path)
            .attr('name', function (d: any) { return d.properties.name; })
            .attr('id', function (d: any) { return d.id })
            .attr('class', 'countries')
            .style('fill', chartObj.colorClosure(this.trendData, this.dataTypeSelected))
            // .on('click', chartObj.selected)
            .on('click', chartObj.selectedClosure(this.selectCountry, this))
            .on('mousemove', chartObj.tooltipClosure(this.trendData))
            .on('mouseout', function (d, i) {
                chartObj.tooltip.classed('hidden', true);
            })
            .attr('d', chartObj.path);
        return chartObj;
        // usa = d3.select('#USA');
        // canada = d3.select('#CAN');
        // let mapFeaturesStates: any = (feature(world as any, (world as any).objects.states));
        // g.append('g')
        //     .attr('class', 'boundary state hidden')
        //     .selectAll('boundary')
        //     .data(mapFeaturesStates.features)
        //     .enter().append('path')
        //     .attr('d', path)
        //     .attr('name', function (d: any) { return d.properties.name; })
        //     .attr('id', function (d: any) { return d.id })
        //     .on('click', selected)
        //     .on('mousemove', showTooltip)
        //     .on('mouseout', function (d, i) {
        //         tooltip.classed('hidden', true);
        //     })
        //     .attr('d', path);
        // states = d3.selectAll('.state');

    }



}
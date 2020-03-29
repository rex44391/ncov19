import { Component, ViewChild, ElementRef, OnChanges, Input, ViewEncapsulation } from "@angular/core";
import * as d3 from 'd3';
import { feature } from 'topojson';;

@Component({
    selector: 'app-trend-chart',
    templateUrl: './trend-chart.component.html',
    styleUrls: ['./trend-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TrendChartComponent implements OnChanges {
    @ViewChild('chart') private chartContainer: ElementRef;

    // @Input() data: DataModel[];
    @Input() trendData: any;
    world;
    ncovData;

    constructor() { }
    ngOnChanges() {
        if (!this.trendData) { return; }
        this.world = this.trendData.world;
        this.ncovData = this.trendData.ncov;
        this.createChart();
    }



    private createChart(): void {
        d3.select('svg').remove();

        const element = this.chartContainer.nativeElement;


        const width = 962;
        const height = 502;


        let usa, canada;
        let states;

        let initX;
        let mouseClicked = false;
        let s = 1;
        let rotated = 90;

        let mouse;

        const offsetL = document.getElementById('map').offsetLeft + 10;
        const offsetT = document.getElementById('map').offsetTop + 10;
        const tooltip = d3.select('#map')
            .append('div')
            .attr('class', 'tooptip hidden');

        const projection = d3.geoMercator()
            .scale(153)
            .translate([width / 2, height / 1.5])
            .rotate([rotated, 0, 0])

        const path = d3.geoPath().projection(projection);


        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on('zoom', zoomed)
            .on('end', zoomended);

        const svg = d3.select(element).append('svg')
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight)
            .on("wheel", function () {
                initX = d3.mouse(this)[0];
            })
            .on("mousedown", function () {
                d3.event.preventDefault();
                if (s !== 1) return;
                initX = d3.mouse(this)[0];
                mouseClicked = true;
            })
            .call(zoom);

        const g = svg.append('g');

        function rotateMap(endX) {
            projection.rotate([rotated + (endX - initX) * 360 / (s * width), 0, 0]);
            g.selectAll('path').attr('d', path);
        }

        function zoomended() {
            if (s !== 1) return;
            if (mouse) {
                rotated = rotated + ((mouse[0] - initX) * 360 / (s * width));
                mouseClicked = false;
            }
        }

        function zoomed() {
            let t = [d3.event.transform.x, d3.event.transform.y];
            s = d3.event.transform.k;
            let h = 0;

            t[0] = Math.min(
                (width / height) * (s - 1),
                Math.max(width * (1 - s), t[0])
            );

            t[1] = Math.min(
                h * (s - 1) + h * s,
                Math.max(height * (1 - s) - h * s, t[1])
            );

            g.attr("transform", "translate(" + t + ")scale(" + s + ")");

            // d3.selectAll(".boundary").style("stroke-width", 1 / s);

            mouse = d3.mouse(this);

            if (s === 1 && mouseClicked) {
                rotateMap(mouse[0]);
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

        function tooltipClosure(ncovData: any) {
            return (d: any) => {
                let confirmed = 'unknown';
                let deaths = 'unknown';
                let recovered = 'unknown';
                if(ncovData[d.properties.name]) {
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
                let mouse = d3.mouse(svg.node())
                    .map(function (d: any) { return parseInt(d); });
                tooltip.classed('hidden', false)
                    .attr('style', `
                        left: ${mouse[0] + offsetL}px;
                        top: ${mouse[1] + offsetT}px;
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

        function selected() {
            d3.select('.selected').classed('selected', false);
            d3.select(this).classed('selected', true);
        }

        function colorClosure(ncovData: any) {
            return (d: any) => {
                let countryName = d.properties.name;
                if(ncovData && ncovData[countryName]) {
                    let confirmed = ncovData[countryName][ncovData[countryName].length - 1].confirmed;
                    switch (true) {
                        case (confirmed === 0):
                            return '#F2F2F2';
                        case (confirmed < 10):
                            return '#FFE6E6';
                        case (confirmed < 100):
                            return '#FFB3B3';
                        case (confirmed < 500):
                            return '#FF8080';
                        case (confirmed < 1000):
                            return '#FF4D4D';
                        case (confirmed < 5000):
                            return '#FF1A1A';
                        case (confirmed < 10000):
                            return '#E60000';
                        case (confirmed < 25000):
                            return '#B30000';
                        case (confirmed < 50000):
                            return '#800000';
                        default:
                            return '#4D0000';
                }
                } else {
                    // console.log(ncovData);
                    // console.log(countryName);
                }
                return '#F2F2F2';

            }
        }
        
        let mapFeatures: any = (feature(this.world as any, (this.world as any).objects.countries));
        g.append('g')
            .attr('class', 'boundary')
            .selectAll('boundary')
            .data(mapFeatures.features)
            .enter().append('path')
            .attr('d', path)
            .attr('name', function (d: any) { return d.properties.name; })
            .attr('id', function (d: any) { return d.id })
            .style('fill', colorClosure(this.ncovData))
            .on('click', selected)
            .on('mousemove', tooltipClosure(this.ncovData))
            .on('mouseout', function (d, i) {
                tooltip.classed('hidden', true);
             })
            .attr('d', path);

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
import { Component, ViewChild, ElementRef, OnChanges, Input, ViewEncapsulation, AfterViewInit } from "@angular/core";
import * as d3 from 'd3';
import { feature } from 'topojson';;
import { DataModel } from 'src/app/data/data.model';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnChanges, AfterViewInit {
    @ViewChild('lineChart') private chartContainer: ElementRef;

    constructor(private httpClient: HttpClient) {
    }

    ngOnChanges() {
        this.createChart();
    }

    ngAfterViewInit() {
        this.createChart();
    }


    @Input() data: DataModel[];


    private createChart(): void {
        d3.select('svg').remove();
        const element = this.chartContainer.nativeElement;

        const margin = { top: 20, right: 80, bottom: 30, left: 50 };
        
        const parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
        let width = 300;
        let height = 100;
        //define scales
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
        const color = d3.scaleOrdinal().range(d3.schemeCategory10);

        //define axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const line = d3.line().curve(d3.curveMonotoneX)
          .x(function(d: any) {
            return xScale(d['date']);
          })
          .y(function(d) {
            return yScale(d['concentration']);
          });
        
        
        //define svg canvas
        const svg = d3.select(element).append('svg')
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight)
            .append('g')
            .attr(`transform`, `translate(${margin.left}, ${margin.top})`);
        //Read data
        d3.csv('assets/giniLine.csv').then(function(data) {
            let productCategories = d3.keys(data[0]).filter(function(key) {
                return key !== "Order Month" && key !== "metric";
            });
            
            color.domain(productCategories);
            
            data.forEach(function(d: any) {
                d["Order Month"] = parseDate(d["Order Month"]);
            });

            const subset = data.filter(function(el) {
              return el.metric === 'Quantity';
            });
            
            const concentrations = productCategories.map(function(category) {
              return {
                category: category,
                datapoints: subset.map(function(d) {
                  return { date: d["Order Month"], concentration: +d[category] };
                })
              };
            });

            xScale.domain(d3.extent(subset, function(d: any) {
              return d['Order MOnth'];
            }))

            yScale.domain([0.25, 0.5]);

            svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', `translate(0, ${+height})`)
              .call(xAxis);
            
            svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('class', 'label')
              .attr('y', 6)
              .attr('dx', '.71em')
              .attr('dy', '.71em')
              .style('text-anchor', 'beginning')
              .text('Product Concentration');
            
            const products = svg
              .selectAll('.category')
              .data(concentrations)
              .enter().append('g')
              .attr('class', 'category');
            
            // products.append('path')
            //   .attr('class', 'line')
            //   .attr('d', function(d: any) {
            //     return line(d.datapoints);
            //   })
              // .style('stroke', function(d: any) {
              //   return color(d.category);
              // });

        })

        
    }
}
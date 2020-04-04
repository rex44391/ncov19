import { Component, OnChanges, Input, ViewEncapsulation } from "@angular/core";
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnChanges {
  @Input() lineData: any;
  chartObj;
  constructor() {
  }

  ngOnChanges() {
    if (!this.lineData) { return; }
    if(!this.chartObj) {
      this.chartObj = this.createChart();
    } else {
      this.chartObj['data'] = this.lineData;
      this.chartObj['update_data']();
    }
    // setTimeout(() => {
    //   chartObj['data'].push({
    //     date: "2020-04-01",
    //     confirmed: 200000,
    //     deaths: 8000,
    //     recovered: 3000
    //   });
    //   chartObj['data'].push({
    //     date: "2020-04-02",
    //     confirmed: 210000,
    //     deaths: 8100,
    //     recovered: 3100
    //   });
    //   chartObj['update_data']();
    // }, 2000);
  }



  private createChart() {
    // d3.select('svg').remove();
    // let temp_y = 1900;

    let chartObj = {};
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const myColor = function (d) {
      if (d === 'confirmed') {
        return '#ff0000';
      } else if (d === 'deaths') {
        return '#404040';
      } else {
        return '#0099ff';
      }
    }
    let xName = 'date';
    let yObjs = {
      'confirmed': { column: 'confirmed' },
      'deaths': { column: 'deaths' },
      'recovered': { column: 'recovered' },
    }
    let axisLables = { xAxis: 'Date', yAxis: 'Amount' };

    chartObj['xAxisLable'] = axisLables.xAxis;
    chartObj['yAxisLable'] = axisLables.yAxis;
    chartObj['data'] = this.lineData;
    chartObj['margin'] = { top: 15, right: 60, bottom: 30, left: 50 };
    chartObj['width'] = 650 - chartObj['margin']['left'] - chartObj['margin']['right'];
    chartObj['height'] = 480 - chartObj['margin']['top'] - chartObj['margin']['bottom'];
    chartObj['xFunct'] = function (d: any) { return d3.timeParse('%Y-%m-%d')(d[xName]) };

    function getYFn(column) {
      return function (d) {
        return d[column];
      };
    }

    chartObj['yFuncts'] = [];
    for (let y in yObjs) {
      yObjs[y].name = y;
      yObjs[y].yFunct = getYFn(yObjs[y].column); //Need this  list for the ymax function
      chartObj['yFuncts'].push(yObjs[y].yFunct);
    }

    //Formatter functions for the axes
    chartObj['formatAsNumber'] = d3.format(".0f");
    chartObj['formatAsDecimal'] = d3.format(".2f");
    chartObj['formatAsCurrency'] = d3.format("$.2f");
    chartObj['formatAsDate'] = d3.timeFormat("%d-%b");
    chartObj['formatAsFloat'] = function (d) {
      if (d % 1 !== 0) {
        return d3.format(".2f")(d);
      } else {
        return d3.format(".0f")(d);
      }

    };

    chartObj['xFormatter'] = chartObj['formatAsDate'];
    chartObj['yFormatter'] = chartObj['formatAsFloat'];

    //Create scale functions
    chartObj['xScale'] = d3.scaleTime().range([0, chartObj['width']])
      .domain(<[any, any]>d3.extent(chartObj['data'], chartObj['xFunct'])); //< Can be overridden in definition
    // Get the max of every yFunct
    chartObj['max'] = function (fn) {
      return d3.max(chartObj['data'], fn);
    };
    chartObj['yScale'] = d3.scaleLinear().range([chartObj['height'], 0])
      .domain(<[any, any]>[0, d3.max(chartObj['yFuncts'].map(chartObj['max']))]);

    chartObj['formatAsYear'] = d3.format("");

    //Create axis
    chartObj['xAxis'] = d3.axisBottom(chartObj['xScale']).tickFormat(chartObj['xFormatter']); //< Can be overridden in definition

    chartObj['yAxis'] = d3.axisLeft(chartObj['yScale']).tickFormat(chartObj['yFormatter']); //< Can be overridden in definition


    // Build line building functions
    function getYScaleFn(yObj) {
      return function (d) {
        return chartObj['yScale'](yObjs[yObj].yFunct(d));
      };
    }
    for (var yObj in yObjs) {
      yObjs[yObj].line = d3.line().curve(d3.curveCardinal).x(function (d) {
        return chartObj['xScale'](chartObj['xFunct'](d));
      }).y(getYScaleFn(yObj));
    }


    chartObj['svg'];

    // Change chart size according to window size
    chartObj['update_svg_size'] = function () {
      chartObj['width'] = parseInt(chartObj['chartDiv']['style']("width"), 10) - (chartObj['margin'].left + chartObj['margin'].right);
      chartObj['height'] = parseInt(chartObj['chartDiv']['style']("height"), 10) - (chartObj['margin'].top + chartObj['margin'].bottom);
      /* Update the range of the scale with new width/height */
      chartObj['xScale'].range([0, chartObj['width']]);
      chartObj['yScale'].range([chartObj['height'], 0]);

      if (!chartObj['svg']) { return false; }
      /* Else Update the axis with the new scale */
      chartObj['svg'].select('.x.axis')
        .attr("transform", "translate(0," + chartObj['height'] + ")").call(chartObj['xAxis']);
      chartObj['svg'].select('.x.axis .label')
        .attr("x", chartObj['width'] / 2);

      chartObj['svg'].select('.y.axis')
        .call(chartObj['yAxis']);
      chartObj['svg'].select('.y.axis .label')
        .attr("x", -chartObj['height'] / 2);

      /* Force D3 to recalculate and update the line */
      for (var y in yObjs) {
        yObjs[y].path.attr("d", yObjs[y].line);
      }


      d3.selectAll(".focus.line").attr("y2", chartObj['height']);

      chartObj['chartDiv'].select('svg')
        .attr("width", chartObj['width'] + (chartObj['margin'].left + chartObj['margin'].right))
        .attr("height", chartObj['height'] + (chartObj['margin'].top + chartObj['margin'].bottom));
      chartObj['svg'].select(".overlay")
        .attr("width", chartObj['width'])
        .attr("height", chartObj['height']);
      return chartObj;
    };

    chartObj['update_data'] = function () {
      chartObj['width'] = parseInt(chartObj['chartDiv']['style']("width"), 10) - (chartObj['margin'].left + chartObj['margin'].right);
      chartObj['height'] = parseInt(chartObj['chartDiv']['style']("height"), 10) - (chartObj['margin'].top + chartObj['margin'].bottom);
      /* Update the range of the scale with new width/height */
      chartObj['xScale'].range([0, chartObj['width']])
        .domain(<[any, any]>d3.extent(chartObj['data'], chartObj['xFunct'])); //< Can be overridden in definition
      chartObj['yScale'].range([chartObj['height'], 0])
        .domain(<[any, any]>[0, d3.max(chartObj['yFuncts'].map(chartObj['max']))]);

      if (!chartObj['svg']) { return false; }
      /* Else Update the axis with the new scale */
      chartObj['svg'].select('.x.axis')
        .transition()
        .duration(500)
        .attr("transform", "translate(0," + chartObj['height'] + ")").call(chartObj['xAxis']);
      chartObj['svg'].select('.x.axis .label')
        .transition()
        .duration(500)
        .attr("x", chartObj['width'] / 2);

      chartObj['svg'].select('.y.axis')
        .transition()
        .duration(500)
        .call(chartObj['yAxis']);
      chartObj['svg'].select('.y.axis .label')
        .transition()
        .duration(500)
        .attr("x", -chartObj['height'] / 2);

      /* Force D3 to recalculate and update the line */
      for (var y in yObjs) {
        yObjs[y].path
          .datum(chartObj['data'])
          .transition()
          .duration(500)
          .attr("class", "line")
          .attr("d", yObjs[y].line)
          .style("stroke", myColor(y))
          .attr("data-series", y)
          .attr("d", yObjs[y].line)
      }
      
      d3.selectAll(".focus.line").attr("y2", chartObj['height']);

      chartObj['chartDiv'].select('svg')
        .attr("width", chartObj['width'] + (chartObj['margin'].left + chartObj['margin'].right))
        .attr("height", chartObj['height'] + (chartObj['margin'].top + chartObj['margin'].bottom));
      chartObj['svg'].select(".overlay")
        .attr("width", chartObj['width'])
        .attr("height", chartObj['height']);
      return chartObj;
    }

    chartObj['bind'] = function (selector) {
      chartObj['mainDiv'] = d3.select(selector);
      // Add all the divs to make it centered and responsive
      chartObj['mainDiv'].append("div")
        .attr("class", "inner-wrapper")
        .append("div")
        .attr("class", "outer-box")
        .append("div")
        .attr("class", "inner-box");
      let chartSelector = selector + " .inner-box";
      chartObj['chartDiv'] = d3.select(chartSelector);
      d3.select(window).on('resize.' + chartSelector, chartObj['update_svg_size']);
      chartObj['update_svg_size']();
      return chartObj;
    };

    // Render the chart
    chartObj['render'] = function () {
      //Create SVG element
      chartObj['svg'] = chartObj['chartDiv'].append("svg")
        .attr("class", "chart-area")
        .attr("width", chartObj['width'] + (chartObj['margin'].left + chartObj['margin'].right))
        .attr("height", chartObj['height'] + (chartObj['margin'].top + chartObj['margin'].bottom))
        .append("g")
        .attr("transform", "translate(" + chartObj['margin'].left + "," + chartObj['margin'].top + ")");

      // Draw Lines
      for (var y in yObjs) {
        yObjs[y].path = chartObj['svg'].append("path")
          .datum(chartObj['data'])
          .attr("class", "line")
          .attr("d", yObjs[y].line)
          .style("stroke", myColor(y))
          .attr("data-series", y)
          .on("mouseover", function () {
            focus.style("display", null);
          }).on("mouseout", function () {
            focus.transition().delay(700).style("display", "none");
          }).on("mousemove", mousemove);
      }


      // Draw Axis
      chartObj['svg'].append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartObj['height'] + ")")
        .call(chartObj['xAxis'])
        .append("text")
        .attr("class", "label")
        .attr("x", chartObj['width'] / 2)
        .attr("y", 30)
        .style("text-anchor", "middle")
        .text(chartObj['xAxisLable']);

      chartObj['svg'].append("g")
        .attr("class", "y axis")
        .call(chartObj['yAxis'])
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -42)
        .attr("x", -chartObj['height'] / 2)
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text(chartObj['yAxisLable']);

      //Draw tooltips
      var focus = chartObj['svg'].append("g")
        .attr("class", "focus")
        .style("display", "none");

      for (var y in yObjs) {
        yObjs[y].tooltip = focus.append("g");
        yObjs[y].tooltip.append("circle").attr("r", 5);
        yObjs[y].tooltip.append("rect")
          .attr("x", 8)
          .attr("y", "-5")
          .attr("width", 45)
          .attr("height", '0.75em');
        yObjs[y].tooltip.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");
      }

      // Year label
      focus.append("text")
        .attr("class", "focus year")
        .attr("x", 9)
        .attr("y", 7);
      // Focus line
      focus.append("line")
        .attr("class", "focus line").attr("y1", 0)
        .attr("y2", chartObj['height']);

      //Draw legend
      var legend = chartObj['mainDiv'].append('div').attr("class", "legend");
      for (var y in yObjs) {
        let series = legend.append('div');
        series.append('div')
          .attr("class", "series-marker")
          .style("background-color", myColor(y));
        series.append('p').text(y);
        yObjs[y].legend = series;
      }

      // Overlay to capture hover
      chartObj['svg'].append("rect")
        .attr("class", "overlay")
        .attr("width", chartObj['width'])
        .attr("height", chartObj['height'])
        .on("mouseover", function () {
          focus.style("display", null);
        }).on("mouseout", function () {
          focus.style("display", "none");
        }).on("mousemove", mousemove);

      return chartObj;
      function mousemove() {
        if (!chartObj['data']) return;
        var x0 = d3.timeFormat("%Y-%m-%d")(chartObj['xScale'].invert(d3.mouse(this)[0]));
        var i;
        for (let index = 0; index < chartObj['data'].length; index++) {
          if (chartObj['data'][index].date === x0) {
            i = index;
            break;
          }
        }
        if (!i) return;
        var d = chartObj['data'][i];
        let minY = chartObj['height'];
        for (var y in yObjs) {
          yObjs[y].tooltip
            .attr("transform", "translate(" + chartObj['xScale'](chartObj['xFunct'](d)) + "," + chartObj['yScale'](yObjs[y].yFunct(d)) + ")");
          yObjs[y].tooltip.select("text")
            .text(chartObj['yFormatter'](yObjs[y].yFunct(d)));
          minY = Math.min(minY, chartObj['yScale'](yObjs[y].yFunct(d)));
        }

        focus.select(".focus.line")
          .attr("transform", "translate(" + chartObj['xScale'](chartObj['xFunct'](d)) + ")")
          .attr("y1", minY);

        focus.select(".focus.year")
          .text("Date: " + chartObj['xFormatter'](chartObj['xFunct'](d)));
      }

    };

    chartObj['bind']('#chart-line1');
    chartObj['render']();
    return chartObj;
  }

}
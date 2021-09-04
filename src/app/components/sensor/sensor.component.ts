import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import * as CanvasJS from '../../canvasjs.min';
import { DataPoint } from '../../models/data-point.interface';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements AfterViewInit {
  chart: any;

  ref = "";
  dataPoints: DataPoint[];
  @Input() subject: Subject<any>;

  constructor() {}

  generateChart(): any {
    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: `Car presence`
      },
      axisY: {
        minimum: 0,
        maximum: 1.5,
        interval: 1,
      },
      data: [{
        type: "stepArea",
        color: "#757de8",
        lineColor: "#3f51b5",
        dataPoints: this.dataPoints,
      }]
    });
    return chart
  }

  ngAfterViewInit() {
    this.subject.subscribe({
      next: (item: {ref: string, dp: DataPoint[]}) => {
        console.log("next from sensor component")
        console.log(item)
        this.dataPoints = item.dp
        this.chart.options.data[0].dataPoints = item.dp
        this.chart.options.title.text = `${item.ref} presence`
        this.chart.render();
      }
    })

    this.chart = this.generateChart();
    this.chart.render();
  }
}

import { AfterViewInit, Component, Input } from '@angular/core';
import * as CanvasJS from '../../canvasjs.min';
import { DataPoint } from '../../models/data-point.interface';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements AfterViewInit {
  chart: any;

  @Input() name;
  @Input() dataPoints: DataPoint[];

  constructor() {}

  generateChart(): any {
    let chart = new CanvasJS.Chart(`chartContainer${this.name}`, {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: this.name
      },
      data: [{
        type: "spline",
        dataPoints: this.dataPoints
      }]
    });
    return chart
  }

  ngAfterViewInit() {
    const chart = this.generateChart();

    chart.render();
  }

}

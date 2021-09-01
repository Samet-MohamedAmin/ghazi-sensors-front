import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataPoint } from './services/data-point.interface';
import { SensorService } from './services/sensor.service';

const monthNames: string[] = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  date: Date;

  items: {name: string, dataPoints: DataPoint}[] = []

  constructor(private service: SensorService, private cdRef:ChangeDetectorRef){
    this.date = new Date();
    this.changeDate(this.date);
  }

  changeDate(date: Date) {
    this.service.getSensorsData(date).subscribe(sensors => {
      this.date = date;
      this.items = []
      this.cdRef.detectChanges()
      console.log(date)
      console.log(sensors)
      // const tempData = this.service.getTemp(sensors)
      const humData = this.service.getHum(sensors)
      // this.items.push({name: "Temperature", dataPoints: tempData})
      this.items.push({name: "Humidity", dataPoints: humData})
      this.cdRef.detectChanges()
    })
  }
}

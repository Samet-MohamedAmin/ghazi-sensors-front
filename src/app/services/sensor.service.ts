import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sensors } from './sensor.interface';
import { DataPoint } from './data-point.interface';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  SENSORS_PATH = "/sensors"

  constructor(private http: HttpClient) {}

   getSensorsData(date: Date) {
    const year: number =date.getFullYear();
    const month: number =date.getMonth();
    const day: number = date.getDate();
    const URL:string = environment.BACKEND_URL + this.SENSORS_PATH + `/date/${year}/${month}/${day}`;
    return this.http.get<Sensors[]>(URL);
  }

  getTemp(sensors): DataPoint {
    return sensors.map(s => {const d = new Date(s.date) ;return {y: parseInt(s.temp), label: d.toLocaleTimeString()}})
  }

  getHum(sensors): DataPoint {
    return sensors.map(s => {const d = new Date(s.date) ;return {y: parseInt(s.hum), label: d.toLocaleTimeString()}})
  }
}

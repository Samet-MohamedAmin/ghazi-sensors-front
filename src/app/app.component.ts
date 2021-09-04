import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataPoint } from './models/data-point.interface';
import { SensorService } from './services/sensor.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

const monthNames: string[] = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

const DEFAULT_CAR_REF = "EMPTY REF"
const REFRESH_PERIOD_SECONDS = 5

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  date: Date = new Date();
  ref: string = DEFAULT_CAR_REF;
  
  items: {ref: string, dataPoints: DataPoint[]}[] = []
  
  refList: string[] = [];
  myControl = new FormControl('', [this.ValidateRef(this)]);
  filteredOptions: Observable<string[]>;
  intervalChange;
  
  constructor(private service: SensorService, private cdRef:ChangeDetectorRef){
  }

  ngAfterViewInit(): void {
    this.changeDate(this.date);
  }

  ngOnInit() {
    this.changeRefList()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.myControl.setValue(this.ref);
  }

  ValidateRef(it) {
    return (control: AbstractControl) => {
      if (control.value in it.refList === false) {
        return { invalidRef: true };
      }
      return null;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.refList.filter(option => option.toLowerCase().includes(filterValue));
  }

  changeRef($event: MatAutocompleteSelectedEvent) {
    this.ref = $event.option.value;
    console.log("changeRef");
    console.log(this.ref);
    this.changeInterval();
  }

  changeRefList() {
    // this.ref = DEFAULT_CAR_REF
    this.myControl.setValue(this.ref);
    this.service.getRefList(this.date).subscribe(refList => {
      this.refList = refList
      this.myControl.updateValueAndValidity()
      console.log("RefList")
      console.log(this.refList)
    })
  }


  changeDate(date: Date) {
    this.date = date;
    this.changeRefList()
    this.changeInterval()
  }

  changeInterval() {
    this.change()
    clearInterval(this.intervalChange);
    this.intervalChange = setInterval(() => {
      console.log("start Interval");
      this.change();
    }, REFRESH_PERIOD_SECONDS * 1000);
  }

  change() {
    this.service.getSensorsPresentData(this.ref, this.date).subscribe(sensors => {
      this.items = []
      this.cdRef.detectChanges()
      console.log(this.date)
      console.log(sensors)
      const presentData: DataPoint[] = this.service.getPresentData(sensors)
      this.items.push({ref: this.ref, dataPoints: presentData})
      this.cdRef.detectChanges()
    })
  }

  getErrorMessage(): string {
    if (this.refList.length === 0) {
      return "There are no references on this date"
    }
    return `Reference should be one of the following values: [${this.refList}]`
  }
}

import { Component, ViewChild } from '@angular/core';
import { PersonTO, Service } from './app.service';
import {DxDataGridComponent} from "devextreme-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  data: PersonTO[] = [];

  searchString: string = '';

  gridHeight: number = 300;

 @ViewChild('grid')
 grid: DxDataGridComponent;

 constructor(private service: Service) {
  }

  ngOnInit() {
    this.data = this.service.generateData(1000);
  }

  public validId(id: number): boolean {
    return id % 2 === 0;
  }

  private nameHighlightColor = {
    'color': '#f0ad4e'
  }

  private orgHighlightColor = {
   'color': '#acaaaf'
  }

 public getNameStyle(id: number) {
   if (id % 3 === 0) {
     return this.nameHighlightColor;
   }
   else {
     return {};
   }
 }

  public getOrgStyle(id: number) {
   if (id % 4 === 0) {
     return this.orgHighlightColor;
   }
   else {
     return {};
   }
 }

 onGridSearchChange(e) {
   this.grid.instance.searchByText(e.value);
 }

}

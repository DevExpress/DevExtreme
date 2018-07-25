import { Component, ViewChild } from '@angular/core';
import { Service } from './app.service';
import { DxButtonComponent } from "devextreme-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

 @ViewChild('button')
 button: DxButtonComponent;

  constructor(private service: Service) {
  }

  ngOnInit() {
  }
}

import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
	DxSelectBoxModule,
	DxTextAreaModule,
	DxDateBoxModule,
	DxFormModule
} from 'devextreme-angular';

import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
	enableProdMode();
}

@Component({
	selector: 'demo-app',
	providers: [Service],
	templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})

export class AppComponent {
	employee: Employee;
	positions: string[];
	states: string[];

	constructor(service: Service) {
		this.employee = service.getEmployee();
		this.positions = service.getPositions();
		this.states = service.getStates();
	}
}

@NgModule({
	imports: [
		BrowserModule,
		DxSelectBoxModule,
		DxTextAreaModule,
		DxDateBoxModule,
		DxFormModule
	],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
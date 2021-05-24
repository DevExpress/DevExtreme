import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule, DxTreeListComponent } from 'devextreme-angular';
import { Employee, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})
export class AppComponent {
    @ViewChild(DxTreeListComponent, { static: false }) treeList: DxTreeListComponent

    employees: Employee[];

    constructor(private service: Service) {
        this.employees = service.getEmployees()
    }

    onStateResetClick() {
        this.treeList.instance.state(null)
    }

    onRefreshClick() {
        window.location.reload();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeListModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
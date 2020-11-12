import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Service, Employee, State } from './app.service';

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
    employees: Employee[];
    states: State[];

    constructor(private service: Service) {
        this.employees = service.getEmployees();
        this.states = service.getStates();
        this.cloneIconClick = this.cloneIconClick.bind(this);
    }

    private static isChief(position) {
        return position && ["CEO", "CMO"].indexOf(position.trim().toUpperCase()) >= 0;
    };

    rowValidating(e) {
        const position = e.newData.Position;

        if(AppComponent.isChief(position)) {
            e.errorText = "The company can have only one " + position.toUpperCase() + ". Please choose another position.";
            e.isValid = false;
        }
    }

    editorPreparing(e) {
        if(e.parentType === "dataRow" && e.dataField === "Position") {
            e.editorOptions.readOnly = AppComponent.isChief(e.value);
        }
    }

    allowDeleting(e) {
        return !AppComponent.isChief(e.row.data.Position);
    }

    isCloneIconVisible(e) {
        return !e.row.isEditing && !AppComponent.isChief(e.row.data.Position);
    }

    cloneIconClick(e) {
        const clonedItem = { ...e.row.data, ID: this.service.getMaxID() };

        this.employees.splice(e.row.rowIndex, 0, clonedItem);
        e.event.preventDefault();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    providers: [Service]
})
export class AppComponent {
    dataSource: Employee[];

    constructor(service: Service) {
        this.dataSource = service.getEmployees();
    }

    onExport(e) {
        var headRow = [['Prefix', 'FirstName', 'LastName', 'City', 'State', 'Position', 'BirthDate', 'HireDate']];
        var bodyRows = [];
        for(let i = 0; i < this.dataSource.length; i++) {
            var val = this.dataSource[i];
            bodyRows.push([val.FirstName, val.LastName, val.Prefix, val.City, val.State, val.Position, val.BirthDate, val.HireDate]);
        }
        
        var autoTableOptions = {
            theme: 'plain',
            tableLineColor: 149,
            tableLineWidth: 0.1,
            styles: { textColor: 51, lineColor: 149, lineWidth: 0 },
            columnStyles: {},
            headStyles: { fontStyle: 'normal', textColor: 149, lineWidth: 0.1 },
            bodyStyles: { lineWidth: 0.1 },
            head: headRow,
            body: bodyRows
        };
        
        const doc = new jsPDF();
        doc.autoTable(autoTableOptions);
        doc.save("filePDF.pdf");

        e.cancel = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxButtonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
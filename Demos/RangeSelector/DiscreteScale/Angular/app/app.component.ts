import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';

import { Service, ProductionData } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    dataSource: ProductionData[];
    totalResult = 12809000;

    constructor(service: Service) {
        this.dataSource = service.getData();
    }
    onValueChanged(e) {
        let data = this.dataSource,
            total = 0,
            startIndex,
            endIndex;

        data.forEach((item, index) => {
            if (item.country == e.value[0]) {
                startIndex = index;
            }
            else if (item.country == e.value[1]) {
                endIndex = index;
            }
        }); 

        if(endIndex) {
            data
                .slice(startIndex, endIndex + 1)
                .forEach(function(item){
                    total += item.copper;
                });
        }
        else {
            total = data[startIndex].copper;
        }

        this.totalResult = total;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxRangeSelectorModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
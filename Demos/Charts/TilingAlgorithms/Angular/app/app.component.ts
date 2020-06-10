import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeMapModule, DxSelectBoxModule } from 'devextreme-angular';
import { PopulationByAge, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    getPopulationsByAge: PopulationByAge[];
    algorithms = ["sliceAndDice", "squarified", "strip", "custom"];

    constructor(service: Service) {
        this.getPopulationsByAge = service.getPopulationsByAge();
    }
    customizeTooltip(arg) {
        var data = arg.node.data,
            parentData = arg.node.getParent().data,
            result = "";

        if (arg.node.isLeaf()) {
            result = "<span class='country'>" + parentData.name + "</span><br />" +
                data.name + "<br />" + arg.valueText + " (" +
                (100 * data.value/parentData.total).toFixed(1) + "%)";
        } else {
            result = "<span class='country'>" + data.name + "</span>";
        }

        return {
            text: result
        };
    }
    customAlgorithm(arg) {
        var side = 0,
            totalRect = arg.rect.slice(),
            totalSum = arg.sum;

        arg.items.forEach(function (item) {
            var size = Math.round((totalRect[side + 2] -
                    totalRect[side]) * item.value / totalSum),
                pos,
                rect = totalRect.slice();

            totalSum -= item.value;
            rect[side + 2] = totalRect[side] = totalRect[side] + size;
            item.rect = rect;
            side = 1 - side;
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeMapModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
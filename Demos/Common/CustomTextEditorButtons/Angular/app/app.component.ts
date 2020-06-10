import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
    DxTextBoxModule,
    DxNumberBoxModule,
    DxDateBoxModule
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})

export class AppComponent {
    passwordMode: string;
    passwordButton: any;
    currencyFormat: string;
    currencyButton: any;
    priceValue: number;
    dateValue: number;
    todayButton: any;
    prevDateButton: any;
    nextDateButton: any;
    millisecondsInDay = 24 * 60 * 60 * 1000;

    constructor() {
        this.passwordMode = 'password';
        this.passwordButton = {
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVRYw+2YP0tcQRTFz65xFVJZpBBS2O2qVSrRUkwqYfUDpBbWQu3ELt/HLRQ/Q8RCGxVJrRDEwj9sTATxZ/Hugo4zL/NmV1xhD9xi59177pl9986fVwLUSyi/tYC+oL6gbuNDYtyUpLqkaUmfJY3a+G9JZ5J2JW1J2ivMDBSxeWCfeBxYTHSOWMcRYLOAEBebxtEVQWPASQdi2jgxro4E1YDTQIJjYM18hszGbew4EHNq/kmCvgDnHtI7YBko58SWgSXg1hN/btyFBM0AlwExczG1YDZrMS4uLUeUoDmgFfjLGwXEtG05wNXyTc4NXgzMCOAIGHD8q0ATuDZrempkwGJ9+AfUQ4K+A/eEseqZ/UbgdUw4fqs5vPeW+5mgBvBAPkLd8cPju+341P7D/WAaJGCdOFQI14kr6o/zvBKZYz11L5Okv5KGA89Kzu9K0b0s5ZXt5PjuOL6TRV5ZalFP4F+rrnhZ1Cs5vN6ijmn7Q162/ThZq9+YNW3MbfvDAOed5cxdGL+RFaUPKQtjI8DVAr66/u9i6+jJzTXm+HFEVqxVYBD4SNZNKzk109HxoycPaG0bIeugVDTp4hH2qdXJDu6xOAAWiuQoQdLHhvY1aEZSVdInG7+Q9EvSz9RrUKqgV0PP3Vz7gvqCOsUj+CxC9LB1Dc8AAAASdEVYdEVYSUY6T3JpZW50YXRpb24AMYRY7O8AAAAASUVORK5CYII=",
            type: "default",
            onClick: () => {
                this.passwordMode = this.passwordMode === "text" ? "password" : "text";
            }
        };

        this.currencyFormat = "$ #.##";
        this.priceValue = 14500.55;
        this.currencyButton = {
            text: "€",
            stylingMode: "text",
            width: 32,
            elementAttr: {
                class: "currency"
            },
            onClick: (e) => {
                if(e.component.option("text") === "$") {
                    e.component.option("text", "€");
                    this.currencyFormat = "$ #.##";
                    this.priceValue /= 0.891;
                } else {
                    e.component.option("text", "$");
                    this.currencyFormat = "€ #.##";
                    this.priceValue *= 0.891;
                }
            }
        };

        this.dateValue = new Date().getTime();

        this.todayButton = {
            text: "Today",
            onClick: () => {
                this.dateValue = new Date().getTime();
            }
        };
        
        this.prevDateButton = {
            icon: "spinprev",
            stylingMode: "text",
            onClick: () => {
                this.dateValue -= this.millisecondsInDay;
            }
        };
        
        this.nextDateButton = {
           icon: "spinnext",
           stylingMode: "text",
           onClick: () => {
               this.dateValue += this.millisecondsInDay;
           }
        };
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTextBoxModule,
        DxNumberBoxModule,
        DxDateBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

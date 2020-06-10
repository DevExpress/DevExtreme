import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxSlideOutModule, DxToolbarModule, DxSwitchModule, DxTemplateModule } from 'devextreme-angular';

import { Category, Service } from './app.service';

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
    dataSource: Category[];
    menuVisible: boolean;
    toolbarItems: any[];

    constructor(service: Service) {
        this.menuVisible = true;
        this.toolbarItems = [
            {
                location: 'before',
                widget: 'dxButton',
                options: {
                    icon: 'menu',
                    onClick: () => {
                        this.menuVisible = !this.menuVisible;
                    }
                }
            }, {
                location: 'center',
                template: 'title'
            }
        ];
        this.dataSource = service.getProducts();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSlideOutModule,
        DxToolbarModule,
        DxSwitchModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
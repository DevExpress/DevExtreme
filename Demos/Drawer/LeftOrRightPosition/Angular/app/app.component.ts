import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { List, Service } from './app.service';
import { DxDrawerComponent, DxDrawerModule, DxListModule, DxRadioGroupModule, DxToolbarModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
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
    @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;
    navigation: List[];
    showSubmenuModes: string[] = ['slide', 'expand'];
    positionModes: string[] = ['left', 'right'];
    showModes: string[] = ['push', 'shrink', 'overlap'];
    text: string;
    selectedOpenMode: string = 'shrink';
    selectedPosition: string = 'left';
    selectedRevealMode: string = 'slide';
    isDrawerOpen: Boolean = true;
    elementAttr: any;

    constructor(service: Service) {
        this.text = service.getContent();
        this.navigation = service.getNavigationList();
    }

    toolbarContent = [{
        widget: 'dxButton',
        location: 'before',
        options: {
            icon: 'menu',
            onClick: () => this.isDrawerOpen = !this.isDrawerOpen
        }
    }];
}

@NgModule({
    imports: [
        BrowserModule,
        DxDrawerModule,
        DxListModule,
        DxRadioGroupModule,
        DxToolbarModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
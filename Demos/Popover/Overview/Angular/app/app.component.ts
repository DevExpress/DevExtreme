import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPopoverModule, DxTemplateModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    defaultVisible: boolean;
    withTitleVisible: boolean;
    withAnimationOptionsVisible: boolean;
    withShadingOptionsVisible: boolean;

    constructor() {
        this.defaultVisible = false;
        this.withTitleVisible = false;
        this.withAnimationOptionsVisible = false;
        this.withShadingOptionsVisible = false;
    }

    toggleDefault() {
        this.defaultVisible = !this.defaultVisible;
    }
    toggleWithTitle() {
        this.withTitleVisible = !this.withTitleVisible;
    }
    toggleWithAnimationOptions() {
        this.withAnimationOptionsVisible = !this.withAnimationOptionsVisible;
    }
    toggleWithShadingOptions() {
        this.withShadingOptionsVisible = !this.withShadingOptionsVisible;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPopoverModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTooltipModule, DxTemplateModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    defaultVisible = false;
    withTemplateVisible = false;
    withAnimationVisible = false;

    constructor() {}

    toggleDefault() {
        this.defaultVisible = !this.defaultVisible;
    }

    toggleWithTemplate() {
        this.withTemplateVisible = !this.withTemplateVisible;
    }

    toggleWithAnimation() {
        this.withAnimationVisible = !this.withAnimationVisible;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTooltipModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

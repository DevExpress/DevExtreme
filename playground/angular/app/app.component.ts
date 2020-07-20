import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule } from 'devextreme/renovation/ui/button';

@Component({
    providers: [],
    selector: 'demo-app',
    styleUrls: [],
    templateUrl: './app/app.component.html',
})
export class AppComponent {
    onClick() {
        alert('clicked');
    }
}
@NgModule({
    imports: [
        BrowserModule,
        DxButtonModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

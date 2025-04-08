import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DxCardViewModule, DxSelectBoxModule } from "devextreme-angular";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { EuropeanUnion, Service } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  unions: EuropeanUnion[];
  languages: string[];
  selectedLanguage: string;
  rtlEnabled = false;
  columns: any[];

  constructor(private service: Service) {
    this.unions = service.getEuropeanUnion();
    this.languages = service.getLanguages();
    this.selectedLanguage = service.getDefaultLanguage();
    this.columns = service.getColumns(false);
  }

  onLanguageChange(event: any) {
    this.rtlEnabled = event.value === this.languages[0];
    this.columns = this.service.getColumns(this.rtlEnabled);
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DxCardViewModule, DxSelectBoxModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxMenuModule } from 'devextreme-angular/ui/menu';
import notify from 'devextreme/ui/notify';
import { Product, Service } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  products: Product[];

  SUBMENU_HEIGHT = 200;

  limitSubmenuHeight = false;

  constructor(service: Service) {
    this.products = service.getProducts();
  }

  itemClick(e: ItemClickEvent) {
    if (!e.itemData.items) {
      notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
    }
  }

  onSubmenuShowing({ submenuContainer }: HTMLElement) {
    submenuContainer.style.maxHeight = this.limitSubmenuHeight ? `${this.SUBMENU_HEIGHT}px` : '';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxMenuModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

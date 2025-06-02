import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxCardViewModule, DxCardViewComponent, DxButtonModule } from 'devextreme-angular';
import { AppService, Employee } from './app.service';

import notify from 'devextreme/ui/notify';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  @ViewChild(DxCardViewComponent, { static: true }) cardView: DxCardViewComponent;

  employees: Employee[];

  // TODO: Nested component does not exist
  headerFilterConfig = {
    visible: true,
  };

  // TODO: Nested component does not exist
  searchPanelConfig = {
    visible: true,
  };

  constructor(service: AppService) {
    this.employees = service.getEmployees();
  }

  imageExpr({ First_Name, Last_Name }: Employee): string {
    return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
  }

  altExpr({ First_Name, Last_Name }: Employee): string {
    return `Photo of ${First_Name} ${Last_Name}`;
  }

  calculateFullName({ First_Name, Last_Name }: Employee): string {
    return `${First_Name} ${Last_Name}`;
  }

  calculateAddress({ State, City }: Employee): string {
    return `${City}, ${State}`;
  }

  calculateAssignedTo = ({ Head_ID }) => {
    const assignedTo = this.employees
      .find((employee) => employee.ID === Head_ID)

    if (!assignedTo) {
      return 'None';
    }

    return `${assignedTo.First_Name} ${assignedTo.Last_Name}`;
  }

  navigateToAssignee = async (value) => {
    document.querySelectorAll('.card-highlight').forEach((card) => {
      card.classList.remove('card-highlight');
    });

    const index = this.employees.findIndex(
      (employee) => employee.ID === value,
    );

    const pageIndex = Math.floor(index / this.cardView.instance.pageSize());
    await this.cardView.instance.pageIndex(pageIndex);

    const cardIndex = this.cardView.instance.getCardIndexByKey(value);
    const cardElement = this.cardView.instance.getCardElement(cardIndex)
    cardElement.focus();
    cardElement.classList.add('card-highlight');
  }

  showNotify(text: string) {
    notify(`The "${text}" button is clicked.`);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

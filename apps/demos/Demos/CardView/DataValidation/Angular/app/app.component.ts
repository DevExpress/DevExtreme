import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule } from 'devextreme-angular';
import { lastValueFrom } from 'rxjs';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];

  phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/i;

  // todo: move to nested components
  searchPanelConfig = {
    visible: true,
  };

  // todo: move to nested components
  popupConfig = {
    title: 'Employee Info',
    showTitle: true,
    width: 700,
    height: 525,
  }

  // todo: move to nested components
  formConfig = {
    items: [
      {
        caption: 'Personal Data',
        itemType: 'group',
        colCount: 2,
        colSpan: 2,
        items: ['firstName', 'lastName', 'birthDate', 'picture'],
      }, {
        caption: 'Main Info',
        itemType: 'group',
        colCount: 2,
        colSpan: 2,
        items: ['hireDate', 'title', {
          dataField: 'notes',
          editorType: 'dxTextArea',
          colSpan: 2,
          editorOptions: {
            height: 100,
          },
        }],
      }, {
        caption: 'Contacts',
        itemType: 'group',
        colCount: 2,
        colSpan: 2,
        items: [
          {
            dataField: 'address',
            colSpan: 2,
          }, 'city', 'zipcode', 'mobilePhone', 'email',
        ],
      },
    ],
  }
  
  constructor(private httpClient: HttpClient, service: Service) {
    this.employees = service.getEmployees();
  }

  altExpr({ fullName }: Employee) {
    return `Photo of ${fullName}`;
  }
  
  imageExpr({ picture }: Employee) {
    return picture;
  }
  
  calculateFullName({firstName, lastName}: Employee) {
    return `${firstName} ${lastName}`;
  }

  async emailValidationCallback(params) {
    const emailValidationUrl = 'https://js.devexpress.com/Demos/NetCore/RemoteValidation/CheckUniqueEmailAddress';

    const result = await lastValueFrom(this.httpClient.post(emailValidationUrl, {
      id: params.data.id,
      email: params.value,
    }, {
      responseType: 'json',
    }));

    return result;
  };

  hireDateValidationCallback(params) {
    return new Date(params.data.hireDate) > new Date(params.data.birthDate);
  };
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

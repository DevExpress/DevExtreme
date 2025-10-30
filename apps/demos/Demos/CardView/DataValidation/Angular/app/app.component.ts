import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule, DxTextAreaModule } from 'devextreme-angular';
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

  popupConfig = {
    title: 'Employee Info',
    showTitle: true,
    width: 700,
    height: 525,
  };

  constructor(private httpClient: HttpClient, service: Service) {
    this.employees = service.getEmployees();
  }

  altExpr({ fullName }: Employee) {
    return `Photo of ${fullName}`;
  }

  imageExpr({ picture }: Employee) {
    return picture;
  }

  calculateFullName({ firstName, lastName }: Employee) {
    return `${firstName} ${lastName}`;
  }

  emailValidationCallback = async (params) => {
    const emailValidationUrl = 'https://js.devexpress.com/Demos/NetCore/RemoteValidation/CheckUniqueEmailAddress';

    const result = await lastValueFrom(this.httpClient.post(emailValidationUrl, {
      id: params.data.id,
      email: params.value,
    }, {
      responseType: 'json',
    }));

    return result;
  };

  hireDateValidationCallback = (params) => new Date(params.value) > new Date(params.data.birthDate);
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxTextAreaModule,
  ],
  providers: [provideHttpClient(withFetch())],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);

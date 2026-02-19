import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCardViewModule, DxTextAreaModule } from 'devextreme-angular';
import { lastValueFrom } from 'rxjs';
import { Employee, Service } from './app.service';
import 'anti-forgery';

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
  imports: [
    DxCardViewModule,
    DxTextAreaModule,
  ],
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

    const result = await lastValueFrom(this.httpClient.get(emailValidationUrl, {
      params: {
        id: params.data.id,
        email: params.value,
      },
      responseType: 'json',
    }));

    return result;
  };

  hireDateValidationCallback = (params) => new Date(params.value) > new Date(params.data.birthDate);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});

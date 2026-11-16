import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxCardViewModule } from 'devextreme-angular';
import 'devextreme/ui/text_area';
import { type Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxCardViewModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly popupConfig = {
    title: 'Employee Info',
    showTitle: true,
    width: 700,
    height: 525,
  };

  altExpr({ fullName }: Employee) {
    return `Photo of ${fullName}`;
  }

  imageExpr({ picture }: Employee) {
    return picture;
  }

  calculateFullName({ firstName, lastName }: Employee) {
    return `${firstName} ${lastName}`;
  }
}

bootstrapApplication(AppComponent);

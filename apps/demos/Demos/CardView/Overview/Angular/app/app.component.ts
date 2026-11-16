import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxCardViewModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { AppService, type Employee } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCardViewModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  readonly employees = inject(AppService).getEmployees();

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

  showNotify(text: string) {
    notify({
      message: `The "${text}" button is clicked.`,
      maxWidth: 560,
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    AppService,
  ],
});

import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxTreeListModule, DxTreeListComponent } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly treeList = viewChild.required(DxTreeListComponent);

  readonly employees = inject(Service).getEmployees();

  onStateResetClick() {
    this.treeList().instance.state(null);
  }

  onRefreshClick() {
    window.location.reload();
  }
}

bootstrapApplication(AppComponent);

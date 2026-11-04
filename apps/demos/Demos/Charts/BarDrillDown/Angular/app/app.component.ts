import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChartModule, DxButtonModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = signal(this.service.filterData(''));

  readonly colors = this.service.getColors();

  readonly isFirstLevel = signal(true);

  onButtonClick() {
    if (!this.isFirstLevel()) {
      this.isFirstLevel.set(true);
      this.dataSource.set(this.service.filterData(''));
    }
  }

  onPointClick(e) {
    if (this.isFirstLevel()) {
      this.isFirstLevel.set(false);
      this.dataSource.set(this.service.filterData(e.target.originalArgument));
    }
  }

  readonly customizePoint = () => ({
    color: this.colors[Number(this.isFirstLevel())],
    ...this.isFirstLevel() ? {} : {
      hoverStyle: {
        hatching: 'none',
      },
    },
  });
}

bootstrapApplication(AppComponent);

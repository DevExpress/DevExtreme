import { Component } from '@angular/core';
import { DevExtremeModule } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  imports: [DevExtremeModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ssr-app';
}

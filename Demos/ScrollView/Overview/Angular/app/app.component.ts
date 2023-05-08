import {
  NgModule, Component, ViewChild, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxScrollViewModule,
  DxScrollViewComponent,
  DxCheckBoxModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent implements AfterViewInit {
  @ViewChild(DxScrollViewComponent, { static: false }) scrollView: DxScrollViewComponent;

  showScrollbarModes: any[];

  content: string;

  updateContentTimer: unknown;

  scrollByContent = true;

  scrollByThumb = true;

  scrollbarMode: string;

  pullDown = false;

  constructor(service: Service) {
    this.content = service.getContent();

    this.showScrollbarModes = [{
      text: 'On Scroll',
      value: 'onScroll',
    }, {
      text: 'On Hover',
      value: 'onHover',
    }, {
      text: 'Always',
      value: 'always',
    }, {
      text: 'Never',
      value: 'never',
    }];

    this.scrollbarMode = this.showScrollbarModes[0].value;
  }

  ngAfterViewInit() {
    this.scrollView.instance.option('onReachBottom', this.updateBottomContent);
  }

  valueChanged = (data) => {
    this.scrollView.instance.option('onReachBottom', data.value ? this.updateBottomContent : null);
  };

  updateContent = (args, eventName) => {
    const updateContentText = `<br /><div>Content has been updated on the ${eventName} event.</div><br />`;
    if (this.updateContentTimer) { clearTimeout(this.updateContentTimer as number); }
    this.updateContentTimer = setTimeout(() => {
      this.content = (eventName == 'PullDown' ? updateContentText + this.content : this.content + updateContentText);
      args.component.release();
    }, 500);
  };

  updateTopContent = (e) => {
    this.updateContent(e, 'PullDown');
  };

  updateBottomContent = (e) => {
    this.updateContent(e, 'ReachBottom');
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxScrollViewModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

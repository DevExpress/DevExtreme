import {
  NgModule, Component, ViewChild, AfterViewInit, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DxScrollViewModule, DxScrollViewComponent, DxScrollViewTypes } from 'devextreme-angular/ui/scroll-view';
import { ScrollbarMode } from 'devextreme-angular/common';
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

  showScrollbarModes: { text: string, value: ScrollbarMode }[] = [
    {
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
    },
  ];

  content: string;

  updateContentTimer: unknown;

  scrollByContent = true;

  scrollByThumb = true;

  scrollbarMode: ScrollbarMode = this.showScrollbarModes[0].value;

  pullDown = false;

  constructor(service: Service) {
    this.content = service.getContent();
  }

  ngAfterViewInit() {
    this.scrollView.instance.option('onReachBottom', this.updateBottomContent);
  }

  valueChanged = (data: DxCheckBoxTypes.ValueChangedEvent) => {
    this.scrollView.instance.option('onReachBottom', data.value ? this.updateBottomContent : null);
  };

  updateContent = (args: DxScrollViewTypes.PullDownEvent | DxScrollViewTypes.ReachBottomEvent, eventName: string) => {
    const updateContentText = `<br /><div>Content has been updated on the ${eventName} event.</div><br />`;
    if (this.updateContentTimer) { clearTimeout(this.updateContentTimer as number); }
    this.updateContentTimer = setTimeout(() => {
      this.content = (eventName == 'PullDown' ? updateContentText + this.content : this.content + updateContentText);
      args.component.release(false);
    }, 500);
  };

  updateTopContent = (e: DxScrollViewTypes.PullDownEvent) => {
    this.updateContent(e, 'PullDown');
  };

  updateBottomContent = (e: DxScrollViewTypes.ReachBottomEvent) => {
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

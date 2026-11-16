import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  type AfterViewInit,
  enableProdMode,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DxScrollViewModule, DxScrollViewComponent, type DxScrollViewTypes } from 'devextreme-angular/ui/scroll-view';
import type { ScrollbarMode } from 'devextreme-angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxScrollViewModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly scrollView = viewChild.required(DxScrollViewComponent);

  readonly showScrollbarModes: { text: string, value: ScrollbarMode }[] = [
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

  readonly content = signal(inject(Service).getContent());

  private updateContentTimer: unknown;

  readonly scrollByContent = signal(true);

  readonly scrollByThumb = signal(true);

  readonly scrollbarMode = signal<ScrollbarMode>(this.showScrollbarModes[0].value);

  readonly pullDown = signal(false);

  readonly useNative = signal<boolean>(undefined);

  ngAfterViewInit() {
    this.scrollView().instance.option('onReachBottom', this.updateBottomContent);
    this.useNative.set(this.scrollView().instance.option('useNative'));
  }

  useNativeChanged = (data: DxCheckBoxTypes.ValueChangedEvent) => {
    this.scrollView().instance.option('useNative', data.value);
    if (data.value && this.scrollbarMode() === 'never') {
      this.scrollbarMode.set('onScroll');
    }
  };

  valueChanged = (data: DxCheckBoxTypes.ValueChangedEvent) => {
    this.scrollView().instance.option('onReachBottom', data.value ? this.updateBottomContent : null);
  };

  updateContent = (args: DxScrollViewTypes.PullDownEvent | DxScrollViewTypes.ReachBottomEvent, eventName: string) => {
    const updateContentText = `<br /><div>Content has been updated on the ${eventName} event.</div><br />`;
    if (this.updateContentTimer) { clearTimeout(this.updateContentTimer as number); }
    this.updateContentTimer = setTimeout(() => {
      this.content.update((content) => (eventName === 'PullDown' ? updateContentText + content : content + updateContentText));
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

bootstrapApplication(AppComponent);

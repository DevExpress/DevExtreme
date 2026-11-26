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

  private updateContentTimer: ReturnType<typeof setTimeout> | undefined;

  readonly scrollByContent = signal(true);

  readonly scrollByThumb = signal(true);

  readonly scrollbarMode = signal<ScrollbarMode>(this.showScrollbarModes[0].value);

  readonly pullDown = signal(false);

  readonly useNative = signal(false);

  ngAfterViewInit(): void {
    this.scrollView().instance.option('onReachBottom', this.updateBottomContent);
    this.useNative.set(this.scrollView().instance.option('useNative') ?? false);
  }

  useNativeChanged = (data: DxCheckBoxTypes.ValueChangedEvent): void => {
    this.scrollView().instance.option('useNative', data.value);
    if (data.value && this.scrollbarMode() === 'never') {
      this.scrollbarMode.set('onScroll');
    }
  };

  valueChanged = (data: DxCheckBoxTypes.ValueChangedEvent): void => {
    this.scrollView().instance.option('onReachBottom', data.value ? this.updateBottomContent : undefined);
  };

  updateContent = (args: DxScrollViewTypes.PullDownEvent | DxScrollViewTypes.ReachBottomEvent, eventName: string): void => {
    const updateContentText = `<br /><div>Content has been updated on the ${eventName} event.</div><br />`;
    if (this.updateContentTimer) { clearTimeout(this.updateContentTimer); }
    this.updateContentTimer = setTimeout(() => {
      this.content.update((content) => (eventName === 'PullDown' ? updateContentText + content : content + updateContentText));
      args.component.release(false);
    }, 500);
  };

  updateTopContent = (e: DxScrollViewTypes.PullDownEvent): void => {
    this.updateContent(e, 'PullDown');
  };

  updateBottomContent = (e: DxScrollViewTypes.ReachBottomEvent): void => {
    this.updateContent(e, 'ReachBottom');
  };
}

bootstrapApplication(AppComponent);

import {
  OnInit,
  Component,
  ComponentRef,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  TransferState,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  DxTemplateHost,
  IterableDifferHelper,
  NestedOptionHost,
  WatcherHelper,
} from 'devextreme-angular/core';
import { DxPopupComponent, DxPopupTypes } from '../component';

@Component({
  standalone: true,
  providers: [
    DxTemplateHost,
    WatcherHelper,
    NestedOptionHost,
    IterableDifferHelper,
  ],
  template: `<ng-container #dxPopupContentContainer></ng-container>`,
})
export class PopupServiceComponent<T> extends DxPopupComponent implements OnInit {
  @ViewChild('dxPopupContentContainer', { read: ViewContainerRef, static: true }) contentContainer!: ViewContainerRef;

  contentRef: ComponentRef<T>;

  constructor(
      @Inject('popupServiceContentComponent') private contentComponent: Type<T>,
      @Inject('popupServiceOptions') private popupOptions: DxPopupTypes.Properties,
      elementRef: ElementRef,
      ngZone: NgZone,
      templateHost: DxTemplateHost,
      _watcherHelper: WatcherHelper,
      _idh: IterableDifferHelper,
      optionHost: NestedOptionHost,
      transferState: TransferState,
      @Inject(PLATFORM_ID) platformId: any,
  ) {
    super(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.popupOptions) {
      this.instance.option(this.popupOptions);
    }

    this.contentRef = this.contentContainer.createComponent(this.contentComponent);
  }
}

import {
  AfterViewInit,
  Component, ComponentRef,
  ElementRef,
  Inject,
  NgZone,
  PLATFORM_ID,
  TransferState, Type,
  ViewChild,
} from '@angular/core';
import {
  DxTemplateHost,
  IterableDifferHelper,
  NestedOptionHost,
  WatcherHelper,
} from 'devextreme-angular/core';
import { DxPopupComponent, DxPopupTypes } from '../component';
import { DxServicePopupInsertionDirective } from './insertion.directive';

@Component({
  standalone: true,
  imports: [DxServicePopupInsertionDirective],
  providers: [
    DxTemplateHost,
    WatcherHelper,
    NestedOptionHost,
    IterableDifferHelper,
  ],
  template: '<ng-template popup-content-insertion></ng-template>',
})
export class PopupServiceComponent<T> extends DxPopupComponent implements AfterViewInit {
  @ViewChild(DxServicePopupInsertionDirective) contentInsertion: DxServicePopupInsertionDirective;

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

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.instance.option(this.popupOptions)

    this.contentRef = this.contentInsertion?.viewContainerRef.createComponent(this.contentComponent);
  }
}

import {
  AfterViewInit,
  Component, ComponentRef,
  ElementRef,
  EventEmitter, Inject,
  NgZone,
  Output, PLATFORM_ID,
  TransferState,
  ViewChild,
} from '@angular/core';
import {
  DxTemplateHost,
  IterableDifferHelper,
  NestedOptionHost,
  WatcherHelper,
} from 'devextreme-angular/core';
import { DxPopupComponent } from 'devextreme-angular/ui/popup/component';
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
export class DxServicePopupComponent extends DxPopupComponent implements AfterViewInit {
  @ViewChild(DxServicePopupInsertionDirective) contentInsertion: DxServicePopupInsertionDirective;

  @Output() afterViewInit$: EventEmitter<void> = new EventEmitter<void>();

  contentRef: ComponentRef<unknown>;

  constructor(
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
    this.afterViewInit$.emit();
  }
}

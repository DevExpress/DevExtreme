import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { useSelector } from '../../../internal/index';
import { SLIDE_TOGGLE_GENERAL_SELECTOR } from '@devexpress/core/src/components/slideToggle';
import { SlideToggleState } from '@devexpress/core/src/components/slideToggle';
import { Observable } from 'rxjs';
import { SLIDE_TOGGLE_CONTEXT_TOKEN, SlideToggleCallbacks, type SlideToggleContext } from '../context';


@Component({
  selector: 'dx-slide-toggle-container',
  template: `
    <ng-container *ngIf="viewModel$ && callbacks">
      <div *ngIf="viewModel$ | async as viewModel"
           class="dx-slide-toggle"
           [class.-left]="viewModel.config.textPosition === 'left'"
           [class.-right]="viewModel.config.textPosition === 'right'"
           (click)="callbacks.valueChange(!viewModel.model.value)">
<!--        <dx-dynamic-template [template]="viewModel.template.indicatorView"-->
<!--                             [data]="{viewModel}">-->
<!--        </dx-dynamic-template>-->
<!--        <dx-dynamic-template [template]="viewModel.template.textView"-->
<!--                             [data]="{viewModel}">-->
<!--        </dx-dynamic-template>-->
      </div>
    </ng-container>
  `,
  styleUrls: ['./dx-slide-toggle-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxSlideToggleContainerComponent implements OnInit {
  callbacks?: SlideToggleCallbacks;
  viewModel$?: Observable<SlideToggleState>;

  constructor(@Inject(SLIDE_TOGGLE_CONTEXT_TOKEN) private contextContainer: SlideToggleContext) {
  }

  ngOnInit(): void {
    const [store, callbacks] = this.contextContainer.context!;
    this.callbacks = callbacks;
    this.viewModel$ = useSelector<SlideToggleState, SlideToggleState>(store, SLIDE_TOGGLE_GENERAL_SELECTOR);
  }
}

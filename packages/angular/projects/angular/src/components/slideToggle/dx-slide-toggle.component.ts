import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnChanges,
  OnInit,
  Optional,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  createSlideToggleStore,
  UpdateValueAction,
  UpdateFromContractsAction, SlideToggleStore
} from '@devexpress/core/src/components/slideToggle';
import {
  SLIDE_TOGGLE_CONTEXT_TOKEN,
  type SlideToggleContext,
  slideToggleContextFactory
} from './context';
import { DxSlideToggleContracts } from './types/index';
import { propsToContracts } from './utils/index';


@Component({
  selector: 'dx-slide-toggle',
  template: `
    <dx-slide-toggle-container>
    </dx-slide-toggle-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: SLIDE_TOGGLE_CONTEXT_TOKEN,
    useFactory: slideToggleContextFactory,
  }],
})
export class DxSlideToggleComponent extends DxSlideToggleContracts
  implements OnInit, OnChanges {

  private store?: SlideToggleStore;

  constructor(@Inject(SLIDE_TOGGLE_CONTEXT_TOKEN) private contextContainer: SlideToggleContext,
              @Optional() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    const contracts = propsToContracts(this);
    this.store = createSlideToggleStore(contracts);
    // init context.
    this.contextContainer.context = [
      this.store,
      {
        valueChange: (value: boolean) => {
          this.store?.dispatch(new UpdateValueAction(value));
          this.valueChange.emit(value);
          this.updateFormValue(value);
        }
      }
    ];
  }

  ngOnChanges(): void {
    this.updateStateFromInputs();
  }

  protected updateStateFromInputs(): void {
    const contracts = propsToContracts(this);
    this.store?.dispatch(new UpdateFromContractsAction(contracts));
  }

  /* Support angular reactive forms methods */
  writeValue(value: boolean): void {
    this.value = value;
    this.updateStateFromInputs();
  }
}

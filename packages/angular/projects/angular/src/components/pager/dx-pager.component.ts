import { ChangeDetectionStrategy, Component, Inject, OnChanges, OnInit } from '@angular/core';
import {
  createPagerStore,
  PagerStore,
  SelectPageAction,
  SelectPageSizeAction,
  UpdateFromContractsAction, validatePageNumber, validatePageSize
} from '@devexpress/core/src/components/pager'
import { createValidator } from '@devexpress/core/src/internal';
import { PAGER_CONTEXT_TOKEN, type PagerContext, pagerContextFactory } from './context';
import { DxPagerContracts } from './types/index';
import { propsToContracts } from './utils/index';

@Component({
  selector: 'dx-pager',
  template: '<dx-pager-container></dx-pager-container>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: PAGER_CONTEXT_TOKEN,
    useFactory: pagerContextFactory,
  }]
})
export class DxPagerComponent extends DxPagerContracts
  implements OnInit, OnChanges {

  private store?: PagerStore;

  constructor(@Inject(PAGER_CONTEXT_TOKEN) private contextContainer: PagerContext) {
    super();
  }

  ngOnInit(): void {
    const contracts = propsToContracts(this);
    this.store = createPagerStore(contracts);

    const pageNumberValidator = createValidator(validatePageNumber);
    const pageSizeValidator = createValidator(validatePageSize);

    this.store.addValidators([pageNumberValidator, pageSizeValidator]);
    this.store.validate();

    // init context
    this.contextContainer.context = [
      this.store,
      {
        selectedPageChange: (value: number) => {
          this.store?.dispatch(new SelectPageAction(value));
          this.selectedPageChange.emit(value);
        },
        selectedPageSizeChange: (value: number) => {
          this.store?.dispatch(new SelectPageSizeAction(value));
          this.selectedPageSizeChange.emit(value);
        }
      }
    ];
  }

  ngOnChanges(): void {
    const contracts = propsToContracts(this);
    this.store?.dispatch(new UpdateFromContractsAction(contracts));
  }
}

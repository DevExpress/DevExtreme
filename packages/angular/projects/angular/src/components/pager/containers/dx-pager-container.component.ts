import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { useSelector } from '../../../internal';
import {
  PAGER_PAGE_NUMBER_SELECTOR,
  PAGER_PAGE_SIZE_SELECTOR, PAGER_ROOT_TEMPLATE_SELECTOR,
  PagerStore,
} from '@devexpress/core/src/components/pager';
import { combineLatest, map, Observable } from 'rxjs';
import { PAGER_CONTEXT_TOKEN, PagerCallbacks, type PagerContext } from '../context';
import { DxPagerViewContracts, DxPagerViewContractsType } from '../views';

@Component({
  selector: 'dx-pager-container',
  template: `
<!--    <dx-dynamic-template *ngIf="template$ && viewModel$"-->
<!--                         [template]="template$ | async"-->
<!--                         [data]="viewModel$ | async">-->
<!--    </dx-dynamic-template>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DxPagerContainerComponent implements OnInit {
  viewModel$?: Observable<DxPagerViewContractsType>;
  template$?: Observable<DxPagerViewContracts>;

  constructor(@Inject(PAGER_CONTEXT_TOKEN) private contextContainer: PagerContext) {
  }

  ngOnInit(): void {
    const [store, callbacks] = this.contextContainer.context!;
    this.viewModel$ = this.getTemplateViewModel(store, callbacks);
    // @ts-ignore
    this.template$ = useSelector(store, PAGER_ROOT_TEMPLATE_SELECTOR).pipe(map(({ template }) => template));
  }

  protected getTemplateViewModel(store: PagerStore, callbacks: PagerCallbacks): Observable<DxPagerViewContractsType> {
    const pageNumberViewModel$ = useSelector(store, PAGER_PAGE_NUMBER_SELECTOR);
    const pageSizeViewModel$ = useSelector(store, PAGER_PAGE_SIZE_SELECTOR);

    // @ts-ignore
    return combineLatest([
      pageNumberViewModel$,
      pageSizeViewModel$
    ]).pipe(
      map(([pageNumberViewModel, pageSizeViewModel]) => ({
        viewModel: {
          pageNumberViewModel,
          pageSizeViewModel,
        },
        actions: {
          selectPage: callbacks.selectedPageChange,
          selectPageSize: callbacks.selectedPageSizeChange,
        }
      }))
    )
  }
}

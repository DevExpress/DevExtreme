import type { ReadonlySignal, Signal } from '@ts/core/reactive/index';
import { computed, effect, signal } from '@ts/core/reactive/index';
import { MAX_PAGES_COUNT } from '@ts/grids/grid_core/pager/m_pager';

import { View } from '../core/view';
import { DataController } from '../data_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { PageSizes } from './options';
import type { PagerProps } from './pager';
import { PagerView as Pager } from './pager';
import { calculatePageSizes, isVisible } from './utils';

export class PagerView extends View<PagerProps> {
  protected override component = Pager;

  public static dependencies = [DataController, OptionsController] as const;

  private readonly pageSizesConfig = this.options.oneWay('pager.allowedPageSizes');

  private readonly allowedPageSizes: Signal<PageSizes | undefined> = signal(undefined);

  private readonly visibleConfig = this.options.oneWay('pager.visible');

  private readonly visible = computed(
    () => isVisible(
      this.visibleConfig.value,
      this.dataController.pageCount.value,
    ),
  );

  constructor(
    private readonly dataController: DataController,
    private readonly options: OptionsController,
  ) {
    super();

    effect(() => {
      this.allowedPageSizes.value = calculatePageSizes(
        this.allowedPageSizes.peek(),
        this.pageSizesConfig.value,
        this.dataController.pageSize.value,
      );
    });
  }

  protected override getProps(): ReadonlySignal<PagerProps> {
    return computed(() => ({
      itemCount: this.dataController.totalCount.value,
      allowedPageSizes: this.allowedPageSizes.value,
      visible: this.visible.value,
      pageIndex: this.dataController.pageIndex.value + 1,
      pageIndexChanged: (value): void => {
        this.dataController.pageIndex.value = value - 1;
      },
      pageSize: this.dataController.pageSize.value,
      pageSizeChanged: (value): void => {
        this.dataController.pageSize.value = value;
      },
      pageCount: this.dataController.pageCount.value,
      showPageSizeSelector: this.options.oneWay('pager.showPageSizeSelector').value,
      _skipValidation: true,
      tabIndex: 0,
      showInfo: this.options.oneWay('pager.showInfo').value,
      showNavigationButtons: this.options.oneWay('pager.showNavigationButtons').value,
      label: this.options.oneWay('pager.label').value,
      pagesNavigatorVisible: this.options.oneWay('pager.visible').value,
      displayMode: this.options.oneWay('pager.displayMode').value,
      maxPagesCount: MAX_PAGES_COUNT,
    }));
  }
}

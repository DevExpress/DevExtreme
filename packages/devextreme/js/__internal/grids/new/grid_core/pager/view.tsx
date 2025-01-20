/* eslint-disable spellcheck/spell-checker */
import type { SubsGets } from '@ts/core/reactive/index';
import { combined, computed } from '@ts/core/reactive/index';

import { View } from '../core/view';
import { DataController } from '../data_controller/index';
import { OptionsController } from '../options_controller/options_controller';
import type { PagerProps } from './pager';
import { PagerView as Pager } from './pager';
import { calculatePageSizes, isVisible } from './utils';

export class PagerView extends View<PagerProps> {
  protected override component = Pager;

  public static dependencies = [DataController, OptionsController] as const;

  private readonly pageSizesConfig = this.options.oneWay('pager.allowedPageSizes');

  private readonly allowedPageSizes = computed(
    (pageSizesConfig, pageSize) => calculatePageSizes(
      this.allowedPageSizes?.unreactive_get(),
      pageSizesConfig,
      pageSize,
    ),
    [this.pageSizesConfig, this.dataController.pageSize],
  );

  private readonly visibleConfig = this.options.oneWay('pager.visible');

  private readonly visible = computed(
    (visibleConfig, pageCount) => isVisible(visibleConfig, pageCount),
    [this.visibleConfig, this.dataController.pageCount],
  );

  constructor(
    private readonly dataController: DataController,
    private readonly options: OptionsController,
  ) {
    super();
  }

  protected override getProps(): SubsGets<PagerProps> {
    return combined({
      allowedPageSizes: this.allowedPageSizes,
      visible: this.visible,
      pageIndex: computed(
        (pageIndex) => (pageIndex ?? 0) + 1,
        [this.dataController.pageIndex],
      ),
      pageIndexChanged: (value): void => this.dataController.pageIndex.update(value - 1),
      pageSize: this.dataController.pageSize,
      pageSizeChanged: (value): void => this.dataController.pageSize.update(value),
      gridCompatibility: false,
      pageCount: this.dataController.pageCount,
      showPageSizeSelector: this.options.oneWay('pager.showPageSizeSelector'),
      _skipValidation: true,
      tabIndex: 0,
    });
  }
}

import ButtonWidget from '@js/ui/button';
import PagerWidget from '@js/ui/pager';
import { computed, Subscribable } from '@ts/core/reactive';
import { InfernoNode } from 'inferno';

import { View } from './core/view';
import { createWidgetWrapper } from './core/widget_wrapper';
import { DataController } from './data_controller/data_controller';

interface PagerProps {
  pageIndex?: number;
  pageSize?: number;

  pageIndexChange?: (value: number) => void;
  pageSizeChange?: (value: number) => void;

  gridCompatibility?: boolean;

  pageSizes?: number[];

  pageCount?: number;
}

const Pager = createWidgetWrapper<PagerProps, any>(PagerWidget);
const Button = createWidgetWrapper(ButtonWidget);

export class PagerView extends View {
  protected vdom = computed(
    (pageIndex, pageSize, totalCount, pageCount) => <div>
      <Pager
        pageIndex={pageIndex}
        pageIndexChange={this.dataController.pageIndex.update}
        pageSize={pageSize}
        pageSizeChange={this.dataController.pageSize.update}
        gridCompatibility={false}
        pageSizes={[1, 2, 5]}
        pageCount={pageCount}
      ></Pager>
    </div>,
    [
      this.dataController.pageIndex,
      this.dataController.pageSize,
      this.dataController.totalCount,
      this.dataController.pageCount,
    ],
  );

  static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();
  }
}

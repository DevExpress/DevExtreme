import ButtonWidget from '@js/ui/button';
import PagerWidget from '@js/ui/pager';
import { computed } from '@ts/core/reactive';
import { render } from 'inferno';

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

export class PagerView extends View {
  public vdom = computed(
    (pageIndex, pageSize, pageCount) => <div>
      <Pager
        pageIndex={pageIndex}
        pageIndexChange={this.dataController.pageIndex.update}
        pageSize={pageSize}
        pageSizeChange={this.dataController.pageSize.update}
        gridCompatibility={false}
        pageSizes={[2, 6, 18]}
        pageCount={pageCount}
      ></Pager>
    </div>,
    [
      this.dataController.pageIndex,
      this.dataController.pageSize,
      this.dataController.pageCount,
    ],
  );

  static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();
  }
}

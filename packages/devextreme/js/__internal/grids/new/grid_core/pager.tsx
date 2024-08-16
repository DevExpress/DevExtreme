import { computed } from '@ts/core/reactive';

import { View } from './core/view';
import { DataController } from './data_controller/data_controller';
import { Pager } from './inferno_wrappers/pager';

export class PagerView extends View {
  public vdom = computed(
    (pageIndex, pageSize, pageCount) => <div>
      <Pager
        pageIndex={pageIndex}
        pageIndexChanged={this.dataController.pageIndex.update}
        pageSize={pageSize}
        pageSizeChanged={this.dataController.pageSize.update}
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

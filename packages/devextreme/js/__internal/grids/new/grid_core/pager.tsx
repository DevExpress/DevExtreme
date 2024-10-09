/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';

import { View } from './core/view';
import { DataController } from './data_controller/index';
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
        // @ts-expect-error
        _skipValidation={true}
      ></Pager>
    </div>,
    [
      this.dataController.pageIndex,
      this.dataController.pageSize,
      this.dataController.pageCount,
    ],
  );

  public static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();
  }
}

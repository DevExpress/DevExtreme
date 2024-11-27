/* eslint-disable spellcheck/spell-checker */
import { computed } from '@ts/core/reactive/index';

import { View } from './core/view';
import { DataController } from './data_controller/index';
import { Pager } from './inferno_wrappers/pager';

export class PagerView extends View {
  public vdom = computed(
    (pageIndex, pageSize, pageCount) => <div>
      <Pager
        // TODO: fix the '??'
        pageIndex={(pageIndex ?? 0) + 1}
        pageIndexChanged={
          (value): void => this.dataController.pageIndex.update(value - 1)
        }
        pageSize={pageSize}
        pageSizeChanged={this.dataController.pageSize.update}
        gridCompatibility={false}
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

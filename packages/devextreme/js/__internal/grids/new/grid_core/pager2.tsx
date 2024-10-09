// @ts-nocheck
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable spellcheck/spell-checker */
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

import { DataController } from './data_controller/index';
import { Pager } from './inferno_wrappers/pager';

interface State {
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;

}

export class PagerView2 extends Component<{}, State> {
  public static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();

    this.state = {
      pageIndex: this.dataController.pageIndex.unreactive_get(),
      pageSize: this.dataController.pageSize.unreactive_get(),
      pageCount: this.dataController.pageCount.unreactive_get(),
    };

    this.dataController.pageIndex.subscribe((pageIndex) => {
      this.setState({ pageIndex });
    });
    this.dataController.pageSize.subscribe((pageSize) => {
      this.setState({ pageSize });
    });
    this.dataController.pageCount.subscribe((pageCount) => {
      this.setState({ pageCount });
    });
  }

  render(): InfernoNode {
    return (
      <div>
        <Pager
          pageIndex={this.state?.pageIndex}
          pageIndexChanged={this.dataController.pageIndex.update}
          pageSize={this.state?.pageSize}
          pageSizeChanged={this.dataController.pageSize.update}
          gridCompatibility={false}
          pageSizes={[1, 2, 5]}
          pageCount={this.state?.pageCount}
        ></Pager>
      </div>
    );
  }
}

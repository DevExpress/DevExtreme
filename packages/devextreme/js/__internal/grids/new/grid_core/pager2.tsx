// @ts-nocheck
import ButtonWidget from '@js/ui/button';
import PagerWidget from '@js/ui/pager';
import { combine, computed, Subscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

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

export class PagerView2 extends Component {
  static dependencies = [DataController] as const;

  constructor(private readonly dataController: DataController) {
    super();

    const state$ = combine({
      pageIndex: this.dataController.pageIndex,
      pageSize: this.dataController.pageSize,
      pageCount: this.dataController.pageCount,
    });

    this.state = state$.unreactive_get();
    state$.subscribe;
  }

  render(): InfernoNode {
    return (
      <div>
        <Pager
          pageIndex={props.pageIndex}
          pageIndexChange={this.dataController.pageIndex.update}
          pageSize={props.pageSize}
          pageSizeChange={this.dataController.pageSize.update}
          gridCompatibility={false}
          pageSizes={[1, 2, 5]}
          pageCount={props.pageCount}
        ></Pager>
      </div>
    );
  }
}

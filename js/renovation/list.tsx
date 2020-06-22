import * as PreactRender from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, Event,
} from 'devextreme-generator/component_declaration/common';
import DataSource, { DataSourceOptions } from '../data/data_source';
import { WidgetProps } from './widget';
import DxList, { dxListItem } from '../ui/list';

export const viewFunction = (viewModel: List) => (
  <div ref={viewModel.widgetRef as any} />
);

@ComponentBindings()
export class ListProps extends WidgetProps {
  // Properties have been copied from ../ui/list.d.ts

  @OneWay() activeStateEnabled?: boolean;

  //   @OneWay() allowItemDeleting?: boolean;

  //   @OneWay() allowItemReordering?: boolean;

  //   @OneWay() bounceEnabled?: boolean;

  //   @OneWay() collapsibleGroups?: boolean;

  @OneWay() dataSource?: string | Array<string | dxListItem | any> | DataSource | DataSourceOptions;

  //   @OneWay() displayExpr?: string | ((item: any) => string);

  @OneWay() focusStateEnabled?: boolean;

  // @Template() groupTemplate?: template
  // | ((groupData: any, groupIndex: number, groupElement: dxElement) => string | Element | JQuery);

  // @OneWay() grouped?: boolean;

  // @OneWay() hoverStateEnabled?: boolean;

  // @OneWay() indicateLoading?: boolean;

  // @OneWay() itemDeleteMode?:
  // 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';

  @OneWay() itemTemplate?: any;

  @Event() onItemClick?: (e: any) => any = (() => {});
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export default class List extends JSXComponent(ListProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    const { itemTemplate } = this.props;

    const renderTemplate = itemTemplate ? (item, index, container) => {
      setTimeout(() => {
        PreactRender.render(
          PreactRender.h(itemTemplate, { item, index, container }), container.get(0),
        );
      }, 0);
    } : undefined;
    const nextProps = {
      ...this.props as any,
      itemTemplate: renderTemplate,
    };

    const instance = DxList.getInstance(this.widgetRef);
    if (instance) {
      instance.option(nextProps);
    } else {
      // eslint-disable-next-line no-new
      new DxList(this.widgetRef, nextProps);
    }
  }
}

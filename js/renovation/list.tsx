import {
  Component, ComponentBindings, JSXComponent, OneWay, Ref, Effect, Event,
} from 'devextreme-generator/component_declaration/common';
import DataSource, { DataSourceOptions } from '../data/data_source';
import { WidgetProps } from './widget';
import DxList, { dxListItem } from '../ui/list';
import { dxElement } from '../core/element';
import { event } from '../events/index';
import renderTemplate from './utils/render-template';

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

  // @OneWay() itemDragging?: dxSortableOptions;

  // @TwoWay() items?: Array<string | dxListItem | any>;

  // @OneWay() menuItems?:
  // Array<{ action?: ((itemElement: dxElement, itemData: any) => any), text?: string }>;

  // @OneWay() menuMode?: 'context' | 'slide';

  // @OneWay() nextButtonText?: string;

  // @Event()onGroupRendered?:((e: {
  //   component?: dxList, element?: dxElement, model?: any, groupData?: any,
  //   groupElement?: dxElement, groupIndex?: number
  // }) => any);

  @Event() onItemClick?: ((e: {
    component?: DxList;
    element?: dxElement;
    model?: any;
    itemData?: any;
    itemElement?: dxElement;
    itemIndex?: number | any;
    jQueryEvent?: JQueryEventObject;
    event?: event;
  }) => any) | string;

  // @Event() onItemContextMenu?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any,
  //   jQueryEvent?: JQueryEventObject, event?: event
  // }) => any);

  // @Event()onItemDeleted?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any,
  //   itemData?: any, itemElement?: dxElement, itemIndex?: number | any
  // }) => any);

  // @Event()onItemDeleting?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any,
  //   cancel?: boolean | Promise<void> | JQueryPromise<void>
  // }) => any);

  // @Event()onItemHold?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any,
  // jQueryEvent?: JQueryEventObject, event?: event
  // }) => any);

  // @Event()onItemReordered?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number
  // }) => any);

  // @Event()onItemSwipe?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any,
  //   jQueryEvent?: JQueryEventObject, event?: event,
  //   itemData?: any, itemElement?: dxElement, itemIndex?: number | any, direction?: string
  // }) => any);

  // @Event()onPageLoading?: ((e: { component?: dxList, element?: dxElement, model?: any }) => any);

  // @Event()onPullRefresh?: ((e: { component?: dxList, element?: dxElement, model?: any }) => any);

  // @Event()onScroll?: ((e: {
  // component?: dxList, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject,
  // event?: event, scrollOffset?: any, reachedLeft?: boolean,
  // reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean
  // }) => any);

  // @Event()onSelectAllValueChanged?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, value?: boolean
  // }) => any);

  // @OneWay()pageLoadMode?: 'nextButton' | 'scrollBottom';

  // @OneWay()pageLoadingText?: string;

  // @OneWay()pullRefreshEnabled?: boolean;

  // @OneWay()pulledDownText?: string;

  // @OneWay()pullingDownText?: string;

  // @OneWay()refreshingText?: string;

  // @OneWay()repaintChangesOnly?: boolean;

  // @OneWay()scrollByContent?: boolean;

  // @OneWay()scrollByThumb?: boolean;

  // @OneWay()scrollingEnabled?: boolean;

  // @OneWay()selectAllMode?: 'allPages' | 'page';

  // @OneWay()selectionMode?: 'all' | 'multiple' | 'none' | 'single';

  // @OneWay()showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';

  // @OneWay()showSelectionControls?: boolean;

  // @OneWay()useNativeScrolling?: boolean;

  @OneWay() itemTemplate?: any;

//   @Event() onItemClick?: (e: any) => any = (() => {});
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class List extends JSXComponent(ListProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  setupWidget() {
    const { itemTemplate } = this.props;

    const template = itemTemplate ? (item, index, container) => {
      renderTemplate(itemTemplate, { item, index, container }, container);
    } : undefined;

    const nextProps = {
      ...this.props as any,
      itemTemplate: template,
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

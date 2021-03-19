import {
  Component, ComponentBindings, JSXComponent, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';
/* eslint-disable import/named */
import DataSource, { DataSourceOptions } from '../../data/data_source';
import type Store from '../../data/abstract_store';
import { WidgetProps } from './common/widget';
import LegacyList, { dxListItem } from '../../ui/list';
import { dxElement } from '../../core/element';
import { event } from '../../events/index';
// import renderTemplate from '../utils/render_template';
import { DomComponentWrapper } from './common/dom_component_wrapper';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: List): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={LegacyList}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);
@ComponentBindings()
export class ListProps extends WidgetProps {
  // Properties have been copied from ../ui/list.d.ts

  @OneWay() activeStateEnabled?: boolean;

  //   @OneWay() allowItemDeleting?: boolean;

  //   @OneWay() allowItemReordering?: boolean;

  //   @OneWay() bounceEnabled?: boolean;

  //   @OneWay() collapsibleGroups?: boolean;

  @OneWay() dataSource?: string | (string | dxListItem | any)[] |
  Store | DataSource | DataSourceOptions;

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
    component?: LegacyList;
    element?: dxElement;
    model?: any;
    itemData: any;
    itemElement?: dxElement;
    itemIndex?: number | any;
    jQueryEvent?: JQueryEventObject;
    event?: event;
  }) => any) | string;

  // @Event() onItemContextMenu?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any,
  //   event?: event
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
  //   event?: event
  // }) => any);

  // @Event()onItemReordered?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any, itemData?: any,
  //   itemElement?: dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number
  // }) => any);

  // @Event()onItemSwipe?: ((e: {
  //   component?: dxList, element?: dxElement, model?: any,
  //   event?: event,
  //   itemData?: any, itemElement?: dxElement, itemIndex?: number | any, direction?: string
  // }) => any);

  // @Event()onPageLoading?: ((e: { component?: dxList, element?: dxElement, model?: any }) => any);

  // @Event()onPullRefresh?: ((e: { component?: dxList, element?: dxElement, model?: any }) => any);

  // @Event()onScroll?: ((e: {
  // component?: dxList, element?: dxElement, model?: any,
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
export class List extends JSXComponent(ListProps) {}

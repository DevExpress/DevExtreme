import {
  Component, ComponentBindings, JSXComponent, OneWay, Event, Template,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import DataSource, { Options as DataSourceOptions } from '../../data/data_source';
import Store from '../../data/abstract_store';
import LegacyList, { dxListItem } from '../../ui/list';
import { DxElement } from '../../core/element';
import { EventExtension, DxEvent } from '../../events/index';

// import renderTemplate from '../utils/render_template';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { BaseWidgetProps } from './common/base_props';

export interface ItemClickInfo {
  component?: LegacyList;
  element?: DxElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData: any;
  itemElement?: DxElement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemIndex?: number | any;
  event?: DxEvent;
}

export type ItemClickEvent = ItemClickInfo & EventExtension;

export const viewFunction = ({
  componentProps,
  restAttributes,
}: List): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyList}
    componentProps={componentProps}
    templateNames={['itemTemplate']}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);
@ComponentBindings()
export class ListProps extends BaseWidgetProps {
  // Properties have been copied from ../ui/list.d.ts

  @OneWay() activeStateEnabled?: boolean;

  //   @OneWay() allowItemDeleting?: boolean;

  //   @OneWay() allowItemReordering?: boolean;

  //   @OneWay() bounceEnabled?: boolean;

  //   @OneWay() collapsibleGroups?: boolean;

  @OneWay() dataSource?:
  | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (string | dxListItem | any)[]
  | Store
  | DataSource
  | DataSourceOptions;

  //   @OneWay() displayExpr?: string | ((item: any) => string);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Template() itemTemplate?: any;

  @OneWay() focusStateEnabled?: boolean;

  // @Template() groupTemplate?: template
  // |((groupData:any, groupIndex: number, groupElement: DxElement) => string | UserDefinedElement);

  // @OneWay() grouped?: boolean;

  // @OneWay() hoverStateEnabled?: boolean;

  // @OneWay() indicateLoading?: boolean;

  // @OneWay() itemDeleteMode?:
  // 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';

  // @OneWay() itemDragging?: dxSortableOptions;

  // @TwoWay() items?: Array<string | dxListItem | any>;

  // @OneWay() menuItems?:
  // Array<{ action?: ((itemElement: DxElement, itemData: any) => any), text?: string }>;

  // @OneWay() menuMode?: 'context' | 'slide';

  // @OneWay() nextButtonText?: string;

  // @Event()onGroupRendered?:((e: {
  //   component?: dxList, element?: DxElement, model?: any, groupData?: any,
  //   groupElement?: DxElement, groupIndex?: number
  // }) => any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() onItemClick?: ((e: ItemClickEvent) => any) | string;

  // @Event() onItemContextMenu?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any, itemData?: any,
  //   itemElement?: DxElement, itemIndex?: number | any,
  //   event?: event
  // }) => any);

  // @Event()onItemDeleted?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any,
  //   itemData?: any, itemElement?: DxElement, itemIndex?: number | any
  // }) => any);

  // @Event()onItemDeleting?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any, itemData?: any,
  //   itemElement?: DxElement, itemIndex?: number | any,
  //   cancel?: boolean | DxPromise
  // }) => any);

  // @Event()onItemHold?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any, itemData?: any,
  //   itemElement?: DxElement, itemIndex?: number | any,
  //   event?: event
  // }) => any);

  // @Event()onItemReordered?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any, itemData?: any,
  //   itemElement?: DxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number
  // }) => any);

  // @Event()onItemSwipe?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any,
  //   event?: event,
  //   itemData?: any, itemElement?: DxElement, itemIndex?: number | any, direction?: string
  // }) => any);

  // @Event()onPageLoading?:((e:{component?: dxList, element?: DxElement, model?: any }) => any);

  // @Event()onPullRefresh?:((e:{component?: dxList, element?: DxElement, model?: any }) => any);

  // @Event()onScroll?: ((e: {
  // component?: dxList, element?: DxElement, model?: any,
  // event?: event, scrollOffset?: any, reachedLeft?: boolean,
  // reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean
  // }) => any);

  // @Event()onSelectAllValueChanged?: ((e: {
  //   component?: dxList, element?: DxElement, model?: any, value?: boolean
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

//   @Event() onItemClick?: (e: any) => any = (() => {});
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class List extends JSXComponent<ListProps>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): ListProps {
    return this.props;
  }
}

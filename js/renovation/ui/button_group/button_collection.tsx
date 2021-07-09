import {
  Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay,
} from '@devextreme-generator/declarations';
import { WidgetProps } from '../common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable-next-line import/named */
// import DataSource, { DataSourceOptions } from '../../../data/data_source';
/* eslint-disable-next-line import/named */
import ButtonCollectionLegacy from '../../../ui/button_group/button_collection';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import dxButtonGroupItem from '../../../ui/button_group';

import { getUpdatedOptions } from '../grids/data_grid/utils/get_updated_options';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: ButtonCollection): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={ButtonCollectionLegacy}
    componentProps={componentProps}
    twoWayProps={['selectedItems', 'selectedItemKeys']}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class ButtonCollectionProps extends WidgetProps {
  // @OneWay() dataSource?: string | (string | any)[] | DataSource | DataSourceOptions;

  // @OneWay() displayExpr?: string;

  // @TwoWay() value: number | null = null;

  // @OneWay() valueExpr?: string;

  // @Event() valueChange?: EventCallback<any>;

  // @OneWay() focusStateEnabled?: boolean = true;

  // @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() buttonTemplate = 'content';

  @OneWay() items?: dxButtonGroupItem[];

  @OneWay() keyExpr?: string = 'text';

  @OneWay() stylingMode: 'outlined' | 'text' | 'contained' = 'contained';

  @OneWay() selectionMode: 'single' | 'multiple' = 'single';

  @OneWay() focusStateEnabled = false;

  @OneWay() scrollingEnabled = false;

  @OneWay() selectionRequired = false;

  @OneWay() noDataText = '';

  @TwoWay() selectedItems?: unknown[] = [];

  @Event() selectedItemsChange?: (selectedItems: unknown[]) => void;

  @TwoWay() selectedItemKeys?: unknown[] = [];

  @Event() selectedItemKeysChange?: (selectedItemKey: unknown[]) => void;

  @Event() onSelectionChanged?: (addedItems: any, removedItems: any) => void;

  @Event() onItemClick?: (e: { event: Event }) => void;

  @Event() onItemRendered?: (e: { event: Event }) => void;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ButtonCollection extends JSXComponent(ButtonCollectionProps) {
  // get buttonComponentProps(): ButtonCollectionProps {
  //   const { rootElementRef, ...restProps } = this.props;

  //   return {
  //     ...restProps,
  //     onOptionChanged: ({ name, value }): void => {
  //       if (name === 'selectedItemKeys') {
  //         const changes = getUpdatedOptions(this.props.selectedItemKeys as any, value);

  //         if (changes.length !== 0) { this.props.selectedItemKeysChange?.(value); }
  //       }
  //     },
  //   } as unknown as ButtonCollectionProps;
  // }
}

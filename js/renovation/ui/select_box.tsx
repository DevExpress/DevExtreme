import {
  Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable-next-line import/named */
import DataSource, { DataSourceOptions } from '../../data/data_source';
/* eslint-disable-next-line import/named */
import LegacySelectBox from '../../ui/select_box';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { EventCallback } from './common/event_callback.d';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: SelectBox): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={LegacySelectBox}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
  @OneWay() dataSource?: string | (string | any)[] | DataSource | DataSourceOptions;

  @OneWay() displayExpr?: string;

  @TwoWay() value: number | null = null;

  @OneWay() valueExpr?: string;

  @Event() valueChange?: EventCallback<any>;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectBox extends JSXComponent(SelectBoxProps) { }

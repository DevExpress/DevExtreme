import {
  Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay,
} from '@devextreme-generator/declarations';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable-next-line import/named */
import DataSource, { DataSourceOptions } from '../../../../data/data_source';
import Store from '../../../../data/abstract_store';
/* eslint-disable-next-line import/named */
import LegacySelectBox from '../../../../ui/select_box';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { EventCallback } from '../../common/event_callback';
import { BaseWidgetProps } from '../../common/base_props';

export const viewFunction = ({
  props,
  restAttributes,
}: SelectBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacySelectBox}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class SelectBoxProps extends BaseWidgetProps {
  @OneWay() dataSource?: string | (string | any)[] | Store | DataSource | DataSourceOptions;

  @OneWay() displayExpr?: string;

  @TwoWay() value: any = null;

  @OneWay() valueExpr?: string;

  @Event() valueChange?: EventCallback<any>;

  @OneWay() focusStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectBox extends JSXComponent(SelectBoxProps) { }

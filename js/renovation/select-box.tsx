import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
import DataSource, { DataSourceOptions } from '../data/data_source';
import DxSelectBox from '../ui/select_box';

export const viewFunction = ({ widgetRef }: SelectBox) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
  @OneWay() dataSource?: string | Array<string | any> | DataSource | DataSourceOptions;

  @OneWay() displayExpr?: string;

  @TwoWay() value?: number;

  @OneWay() valueExpr?: string;

  @Event() valueChange?: ((value: number) => void) = () => { };
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class SelectBox extends JSXComponent(SelectBoxProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget() {
    const widget = DxSelectBox.getInstance(this.widgetRef);
    widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget() {
    const widget = new DxSelectBox(this.widgetRef, this.properties as any);

    return () => widget.dispose();
  }

  get properties() {
    const { valueChange, ...restProps } = this.props;
    return ({ ...restProps, onValueChanged: ({ value }) => valueChange!(value) });
  }
}

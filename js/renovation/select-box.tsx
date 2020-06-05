import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './widget';
// import DataSource, { DataSourceOptions } from '../data/data_source';
import DxSelectBox from '../ui/select_box';

export const viewFunction = ({ widgetRef }: SelectBox) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
  @OneWay() dataSource?: string | Array<string | any>;// | DataSource | DataSourceOptions;

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
  setupWidget() {
    const { valueChange } = this.props;
    const instance = DxSelectBox.getInstance(this.widgetRef);
    if (instance) {
      instance.option({ ...this.props });
    } else {
      new DxSelectBox(this.widgetRef, { // eslint-disable-line no-new
        ...this.props as any,
        onValueChanged: (e) => {
          valueChange!(e.value);
        },
      });
    }
  }
}

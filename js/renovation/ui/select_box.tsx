import {
  Ref, Effect, Component, ComponentBindings, JSXComponent, Event, OneWay, TwoWay, Consumer,
} from 'devextreme-generator/component_declaration/common';
import { WidgetProps } from './common/widget';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable-next-line import/named */
import DataSource, { DataSourceOptions } from '../../data/data_source';
/* eslint-disable-next-line import/named */
import LegacySelectBox, { Options } from '../../ui/select_box';
import { ConfigContextValue, ConfigContext } from './common/config_context';

export const viewFunction = ({ widgetRef }: SelectBox) => (<div ref={widgetRef as any} />);

@ComponentBindings()
export class SelectBoxProps extends WidgetProps {
  @OneWay() dataSource?: string | (string | any)[] | DataSource | DataSourceOptions;

  @OneWay() displayExpr?: string;

  @TwoWay() value: number | null = null;

  @OneWay() valueExpr?: string;

  @Event() valueChange: ((value: number) => void) = () => { };
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectBox extends JSXComponent(SelectBoxProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect()
  updateWidget(): void {
    const widget = LegacySelectBox.getInstance(this.widgetRef);
    widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacySelectBox(this.widgetRef, this.properties);

    return (): void => widget.dispose();
  }

  @Consumer(ConfigContext)
  config!: ConfigContextValue;

  get properties(): Options {
    const { valueChange, ...restProps } = this.props;
    return ({
      rtlEnabled: this.config?.rtlEnabled,
      ...restProps,
      onValueChanged: ({ value }) => valueChange!(value),
    }) as Options;
  }
}

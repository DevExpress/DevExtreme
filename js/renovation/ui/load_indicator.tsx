import {
  Component, ComponentBindings, JSXComponent, OneWay, React,
} from '@devextreme-generator/declarations';

/* eslint-disable-next-line import/named */
import LegacyLoadIndicator from '../../ui/load_indicator';
import { WidgetProps } from './common/widget';
import { DomComponentWrapper } from './common/dom_component_wrapper';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: LoadIndicator): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef as any}
    componentType={LegacyLoadIndicator}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class LoadIndicatorProps extends WidgetProps {
  // props was copied from js\ui\load_indicator.d.ts

  @OneWay() indicatorSrc?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LoadIndicator extends JSXComponent(LoadIndicatorProps) {}

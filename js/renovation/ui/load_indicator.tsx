import {
  Component, ComponentBindings, JSXComponent, OneWay, React,
} from '@devextreme-generator/declarations';

/* eslint-disable-next-line import/named */
import LegacyLoadIndicator from '../../ui/load_indicator';
import { DomComponentWrapper } from './common/dom_component_wrapper';
import { BaseWidgetProps } from './common/base_props';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: LoadIndicator): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={rootElementRef}
    componentType={LegacyLoadIndicator}
    componentProps={componentProps}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class LoadIndicatorProps extends BaseWidgetProps {
  // props was copied from js\ui\load_indicator.d.ts

  @OneWay() indicatorSrc?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LoadIndicator extends JSXComponent(LoadIndicatorProps) {}

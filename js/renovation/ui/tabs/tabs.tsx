import {
  Component, ComponentBindings, JSXComponent, React, OneWay,
} from '@devextreme-generator/declarations';

/* eslint-disable-next-line import/named */
import LegacyTabs from '../../../ui/tabs';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { WidgetProps } from '../common/widget';

export const viewFunction = ({
  props: { rootElementRef, ...componentProps },
  restAttributes,
}: Tabs): JSX.Element => (
  <DomComponentWrapper
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rootElementRef={rootElementRef as any}
    componentType={LegacyTabs}
    componentProps={componentProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class TabsProps extends WidgetProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() items?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() scrollingEnabled?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() onSelectionChanged?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() itemTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class Tabs extends JSXComponent(TabsProps) {}

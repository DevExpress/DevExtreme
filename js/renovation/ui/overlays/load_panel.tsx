import {
  Component, ComponentBindings, JSXComponent, React, OneWay,
} from '@devextreme-generator/declarations';

/* eslint-disable-next-line import/named */
import LegacyLoadPanel from '../../../ui/load_panel';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { OverlayProps } from './overlay';

export const viewFunction = ({
  props,
  restAttributes,
}: LoadPanel): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyLoadPanel}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class LoadPanelProps extends OverlayProps {
  @OneWay() delay?: number;

  @OneWay() message?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LoadPanel extends JSXComponent(LoadPanelProps) {}

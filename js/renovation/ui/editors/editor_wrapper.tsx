import {
  Component, ComponentBindings, JSXComponent, OneWay, Event, React,
} from '@devextreme-generator/declarations';
import { DomComponentWrapper, ComponentProps } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import { EditorProps as NativeEditorProps } from './internal/editor';
import devices from '../../../core/devices';
import { ComponentClass } from '../../../core/dom_component'; // eslint-disable-line import/named

export const viewFunction = ({
  componentProps,
  restAttributes,
  props: { componentType, templateNames },
}: Editor): JSX.Element => (
  <DomComponentWrapper
    componentType={componentType}
    componentProps={componentProps}
    templateNames={templateNames}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class EditorProps extends NativeEditorProps {
  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();

  @Event() valueChange?: EventCallback<unknown>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() componentType?: ComponentClass<Record<string, any>>;

  @OneWay() componentProps?: ComponentProps;

  @OneWay() templateNames?: string[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Editor extends JSXComponent(EditorProps) {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): EditorProps {
    const {
      componentProps, ...otherProps
    } = this.props;

    return { ...otherProps, ...componentProps };
  }
}

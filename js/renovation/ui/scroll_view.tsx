import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  OneWay,
  Method,
  Ref,
} from 'devextreme-generator/component_declaration/common';
import Widget from './widget';
import config from '../core/config';

export const viewFunction = ({
  cssClasses, contentRef,
  props: {
    disabled, height, width, rtlEnabled, children,
  },
}: ScrollView) => (
  <Widget
    classes={cssClasses}
    disabled={disabled}
    rtlEnabled={rtlEnabled}
    height={height}
    width={width}
  >
    <div className="dx-scrollable-wrapper">
      <div className="dx-scrollable-container">
        <div className="dx-scrollable-content" ref={contentRef as any}>
          {children}
        </div>
      </div>
    </div>
  </Widget>
);

@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: any;

  @OneWay() direction?: 'both' | 'horizontal' | 'vertical' = 'vertical';

  @OneWay() disabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() rtlEnabled?: boolean = config().rtlEnabled;

  @OneWay() width?: string | number | (() => (string | number));
}

@Component({
  view: viewFunction,
})

export default class ScrollView extends JSXComponent(ScrollViewProps) {
  @Ref() contentRef!: HTMLDivElement;

  @Method()
  content() {
    return this.contentRef;
  }

  get cssClasses(): string {
    const { direction } = this.props;
    return `dx-scrollview dx-scrollable dx-scrollable-${direction} dx-scrollable-native dx-scrollable-native-generic`;
  }
}

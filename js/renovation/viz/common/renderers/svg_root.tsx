/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable class-methods-use-this */
import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Ref,
  ForwardRef,
  Effect,
  Consumer,
  RefObject,
} from '@devextreme-generator/declarations';
import { ConfigContextValue, ConfigContext } from '../../../common/config_context';

export const viewFunction = ({
  svgRef,
  config,
  styles,
  props: {
    className, width, height, pointerEvents, filter, children,
  },
}: RootSvgElement): JSX.Element => (
  <svg
    ref={svgRef}
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    className={className}
    fill="none"
    stroke="none"
    strokeWidth={0}
    style={styles}
    width={width}
    height={height}
    direction={config?.rtlEnabled ? 'rtl' : 'ltr'}
    pointerEvents={pointerEvents}
    filter={filter}
  >
    {children}
  </svg>
);

@ComponentBindings()
export class RootSvgElementProps {
  @ForwardRef() rootElementRef?: RefObject<SVGElement>;

  @OneWay() className = '';

  @OneWay() height = 0;

  @OneWay() width = 0;

  @OneWay() pointerEvents?: string;

  @OneWay() filter?: string;

  @OneWay() styles?: Record<string, string>;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class RootSvgElement extends JSXComponent(RootSvgElementProps) {
  @Ref() svgRef!: RefObject<SVGSVGElement>;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Effect({ run: 'once' })
  setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      rootElementRef.current = this.svgRef.current;
    }
  }

  // https://trello.com/c/rc9RQJ2y
  get styles(): Record<string, string> {
    return {
      display: 'block',
      overflow: 'hidden',
      lineHeight: 'normal',
      msUserSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      ...this.props.styles,
    };
  }
}

import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  RefObject,
  Event,
  Template,
  Slot,
  Mutable,
  Effect,
  TwoWay,
} from '@devextreme-generator/declarations';
import devices from '../../../core/devices';
import LegacyTooltip from '../../../ui/tooltip';
/* eslint-disable import/named */
import { UserDefinedElement, DxElement } from '../../../core/element';
import { template } from '../../../core/templates/template';
import { AnimationConfig } from '../../../animation/fx';
import { PositionConfig } from '../../../animation/position';
/* eslint-enable import/named */
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseWidgetProps } from '../common/base_props';

const isDesktop = !(!devices.real().generic || devices.isSimulator());

export const viewFunction = ({
  domComponentWrapperRef,
  componentProps,
  restAttributes,
}: Tooltip): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyTooltip}
    componentProps={componentProps.restProps}
    templateNames={[
      'contentTemplate',
    ]}
    ref={domComponentWrapperRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {componentProps.children}
  </DomComponentWrapper>
);

@ComponentBindings()
export class TooltipProps extends BaseWidgetProps {
  @OneWay() animation?: {
    show: AnimationConfig;
    hide: AnimationConfig;
  } = {
    show: { type: 'fade', from: 0, to: 1 },
    hide: { type: 'fade', to: 0 },
  };

  @OneWay() hideOnOutsideClick: boolean | (() => boolean) = true;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

  @OneWay() wrapperAttr = {};

  @OneWay() focusStateEnabled = isDesktop;

  @OneWay() fullScreen = false;

  @OneWay() height: number | string | (() => number | string) = 'auto';

  @OneWay() hideEvent?: string;

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled = false;

  @OneWay() maxHeight?: number | string | (() => number | string) | null = null;

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;

  @OneWay() minHeight?: number | string | (() => number | string) | null = null;

  @OneWay() minWidth?: number | string | (() => number | string) | null = null;

  @Event() onHidden?: () => void;

  @Event() onHiding?: () => void;

  @Event() onInitialized?: () => void;

  @Event() onOptionChanged?: () => void;

  @Event() onShowing?: () => void;

  @Event() onShown?: () => void;

  @Event() onTitleRendered?: () => void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  @OneWay() position: PositionConfig | Function
  | 'bottom' | 'left' | 'right' | 'top'
  = 'bottom';

  @OneWay() rtlEnabled = false;

  @OneWay() shading = false;

  @OneWay() shadingColor = '';

  @OneWay() showEvent?: string;

  @OneWay() target?: string | Element; // Todo: default value

  @TwoWay() visible = true;

  @OneWay() width?: number | string | (() => number | string) = 'auto';

  @Slot() children?: JSX.Element;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Tooltip extends JSXComponent(TooltipProps) {
  @Ref() domComponentWrapperRef!: RefObject<DomComponentWrapper>;

  @Mutable() instance!: { option };

  @Effect()
  saveInstance(): void {
    this.instance = this.domComponentWrapperRef.current?.getInstance() as { option };
  }

  @Effect()
  setHideEventListener(): void {
    this.instance.option('onHiding', () => {
      this.props.visible = false;
    });
  }

  /* istanbul ignore next: WA for Angular */
  get componentProps(): { children?: TooltipProps['children']; restProps: Partial<TooltipProps> } {
    const { children, ...restProps } = this.props;
    return {
      children,
      restProps,
    };
  }
}

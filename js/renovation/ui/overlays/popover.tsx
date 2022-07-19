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
import LegacyPopover from '../../../ui/popover/ui.popover';
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
}: Popover): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyPopover}
    componentProps={componentProps.restProps}
    templateNames={[
      'titleTemplate',
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
export class PopoverProps extends BaseWidgetProps {
  @OneWay() animation?: {
    show: AnimationConfig;
    hide: AnimationConfig;
  } = {
    show: { type: 'fade', from: 0, to: 1 },
    hide: { type: 'fade', to: 0 },
  };

  @OneWay() hideOnOutsideClick: boolean | (() => boolean) = false;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

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
  | 'bottom' | 'left' | 'right' | 'top' = 'bottom';

  @OneWay() rtlEnabled = false;

  @OneWay() shading = false;

  @OneWay() shadingColor = '';

  @OneWay() showCloseButton = isDesktop;

  @OneWay() showEvent?: string;

  @OneWay() showTitle = false;

  @OneWay() target?: string | Element; // TODO: default value

  @OneWay() title = '';

  // titleComponent

  // titleRender

  @Template() titleTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'title';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() toolbarItems?: any;

  @TwoWay() visible = true;

  @OneWay() width: number | string | (() => number | string) = 'auto';

  @Slot() children?: JSX.Element;
}
@Component({
  view: viewFunction,
})
export class Popover extends JSXComponent(PopoverProps) {
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
  get componentProps(): { children?: PopoverProps['children']; restProps: Partial<PopoverProps> } {
    const { children, ...restProps } = this.props;
    return {
      children,
      restProps,
    };
  }
}

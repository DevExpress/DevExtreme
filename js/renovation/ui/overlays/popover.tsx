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
  Method,
  Mutable,
  Effect,
} from '@devextreme-generator/declarations';
import devices from '../../../core/devices';
import LegacyPopover from '../../../ui/popover';
import { UserDefinedElement, DxElement } from '../../../core/element';
import { template } from '../../../core/templates/template';
import { AnimationConfig } from '../../../animation/fx';
import { PositionConfig } from '../../../animation/position';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseWidgetProps } from '../common/base_props';

const isDesktop = !(!devices.real().generic || devices.isSimulator());

export const viewFunction = ({
  wrapperRef,
  props,
  restAttributes,
}: Popover): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyPopover}
    componentProps={props}
    ref={wrapperRef}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {props.children}
  </DomComponentWrapper>
);

@ComponentBindings()
export class PopoverProps extends BaseWidgetProps {
  @OneWay() animation?: { show: AnimationConfig; hide: AnimationConfig } = {
    show: { type: 'fade', from: 0, to: 1 },
    hide: { type: 'fade', to: 0 },
  };

  @OneWay() closeOnOutsideClick: boolean | ((e: any) => boolean) = false;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

  @OneWay() elementAttr?: any; // TODO

  @OneWay() height: number | string | (() => number | string) = 'auto';

  @OneWay() hideEvent?: any; // TODO

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled = false;

  @OneWay() maxHeight?: number | string | (() => number | string) | null = null;

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;

  @OneWay() minHeight?: number | string | (() => number | string) | null = null;

  @OneWay() minWidth?: number | string | (() => number | string) | null = null;

  @Event() onContentReady?: (e: any) => void;

  @Event() onDisposing?: (e: any) => void;

  @Event() onHidden?: (e: any) => void;

  @Event() onHiding?: (e: any) => void;

  @Event() onInitialized?: (e: any) => void;

  @Event() onShowing?: (e: any) => void;

  @Event() onShown?: (e: any) => void;

  @Event() onTitleRendered?: (e: any) => void;

  @OneWay() position?: 'bottom' | 'left' | 'right' | 'top' | PositionConfig | Function;

  @OneWay() rtlEnabled = false;

  @OneWay() shading = false;

  @OneWay() shadingColor = '';

  @OneWay() showCloseButton = isDesktop;

  @OneWay() showEvent?: any;

  @OneWay() showTitle = false;

  @OneWay() target?: any;

  @OneWay() title = '';

  // titleComponent

  // titleRender

  @Template() titleTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'title';

  @OneWay() toolbarItems: any;

  @OneWay() visible = false;

  @OneWay() width: number | string | (() => number | string) = 'auto';

  @Slot() children?: any;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Popover extends JSXComponent(PopoverProps) {
  @Ref() wrapperRef!: RefObject<DomComponentWrapper>;

  @Mutable()
  instance: any;

  @Effect()
  saveInstance(): void {
    this.instance = this.wrapperRef.current?.getInstance();
  }

  @Method()
  show(): void {
    this.instance.show();
  }

  @Method()
  focus(): void {
    this.instance.focus();
  }

  @Method()
  hide(): void {
    this.instance.hide();
  }

  @Method()
  setTarget(target): void {
    this.instance.option('target', target);
  }
}

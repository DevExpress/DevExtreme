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
import LegacyPopup from '../../../ui/popup';
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
}: Popup): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyPopup}
    componentProps={props}
    ref={wrapperRef}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {props.children}
  </DomComponentWrapper>
);

@ComponentBindings()
export class PopupProps extends BaseWidgetProps {
  @OneWay() accessKey?: string;

  @OneWay() animation?: { show: AnimationConfig, hide: AnimationConfig } = {
    show: {
      type: 'slide',
      duration: 400,
      from: { position: { my: 'top', at: 'bottom', of: window } },
      to: { position: { my: 'center', at: 'center', of: window } }
    },
    hide: {
      type: 'slide',
      duration: 400,
      from: { position: { my: 'center', at: 'center', of: window } },
      to: { position: { my: 'top', at: 'bottom', of: window } },
    }
  };

  @OneWay() closeOnOutsideClick: boolean | ((e: any) => boolean) = false;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

  @OneWay() dragEnabled = isDesktop;

  @OneWay() elementAttr?: any; // TODO

  @OneWay() focusStateEnabled = isDesktop;

  @OneWay() fullScreen = false;

  @OneWay() height?: number | string | (() => number | string);

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

  @Event() onOptionChanged?: (e: any) => void;

  @Event() onResize?: (e: any) => void;

  @Event() onResizeEnd?: (e: any) => void;

  @Event() onResizeStart?: (e: any) => void;

  @Event() onShowing?: (e: any) => void;

  @Event() onShown?: (e: any) => void;

  @Event() onTitleRendered?: (e: any) => void;

  @OneWay() position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | PositionConfig | Function;

  @OneWay() resizeEnabled = false;

  @OneWay() rtlEnabled = false;

  @OneWay() shading = true;

  @OneWay() shadingColor = '';

  @OneWay() showCloseButton = isDesktop;

  @OneWay() showTitle = true;

  @OneWay() tabIndex = 0;

  @OneWay() title = '';

  // titleComponent

  // titleRender

  @Template() titleTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'title';

  @OneWay() toolbarItems: any;

  @OneWay() visible = false;

  @OneWay() width?: number | string | (() => number | string);

  @Slot() children?: any;
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Popup extends JSXComponent(PopupProps) {
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
}

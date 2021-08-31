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
} from '@devextreme-generator/declarations';
import { getWindow } from '../../../core/utils/window';
import devices from '../../../core/devices';
import LegacyPopup from '../../../ui/popup';
/* eslint-disable import/named */
import { UserDefinedElement, DxElement } from '../../../core/element';
import { template } from '../../../core/templates/template';
import { AnimationConfig } from '../../../animation/fx';
import { PositionConfig } from '../../../animation/position';
/* eslint-enable import/named */
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseWidgetProps } from '../common/base_props';
import { ToolbarItem } from '../toolbar/toolbar_props';

const isDesktop = !(!devices.real().generic || devices.isSimulator());
const window = getWindow();

export const viewFunction = ({
  wrapperRef,
  props,
  restAttributes,
}: Popup): JSX.Element => {
  const { children } = props;

  return (
    <DomComponentWrapper
      componentType={LegacyPopup}
      componentProps={props}
      ref={wrapperRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      {children}
    </DomComponentWrapper>
  );
};

@ComponentBindings()
export class PopupProps extends BaseWidgetProps {
  @OneWay() accessKey?: string;

  @OneWay() animation?: {
    show: AnimationConfig;
    hide: AnimationConfig;
  } = {
    show: {
      type: 'slide',
      duration: 400,
      from: { position: { my: 'top', at: 'bottom', of: window } },
      to: { position: { my: 'center', at: 'center', of: window } },
    },
    hide: {
      type: 'slide',
      duration: 400,
      from: { position: { my: 'center', at: 'center', of: window } },
      to: { position: { my: 'top', at: 'bottom', of: window } },
    },
  };

  @OneWay() closeOnOutsideClick: boolean | (() => boolean) = false;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

  @OneWay() dragEnabled = isDesktop;

  @OneWay() elementAttr = {};

  @OneWay() focusStateEnabled = isDesktop;

  @OneWay() fullScreen = false;

  @OneWay() height?: number | string | (() => number | string); // TODO: default value

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled = false;

  @OneWay() maxHeight?: number | string | (() => number | string) | null = null;

  @OneWay() maxWidth?: number | string | (() => number | string) | null = null;

  @OneWay() minHeight?: number | string | (() => number | string) | null = null;

  @OneWay() minWidth?: number | string | (() => number | string) | null = null;

  @Event() onContentReady?: () => void;

  @Event() onDisposing?: () => void;

  @Event() onHidden?: () => void;

  @Event() onHiding?: () => void;

  @Event() onInitialized?: () => void;

  @Event() onOptionChanged?: () => void;

  @Event() onResize?: () => void;

  @Event() onResizeEnd?: () => void;

  @Event() onResizeStart?: () => void;

  @Event() onShowing?: () => void;

  @Event() onShown?: () => void;

  @Event() onTitleRendered?: () => void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  @OneWay() position: PositionConfig | Function
  | 'bottom' | 'center' | 'left' | 'left bottom'
  | 'left top' | 'right' | 'right bottom' | 'right top' | 'top'
  = { my: 'center', at: 'center', of: 'window' };

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

  @OneWay() toolbarItems?: ToolbarItem[];

  @OneWay() visible = false;

  @OneWay() width?: number | string | (() => number | string); // TODO: default value

  @Slot() children?: JSX.Element;
}
@Component({
  view: viewFunction,
})
export class Popup extends JSXComponent(PopupProps) {
  @Ref() wrapperRef!: RefObject<DomComponentWrapper>;

  @Mutable() // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any;

  @Effect()
  saveInstance(): void {
    this.instance = this.wrapperRef.current?.getInstance();
  }
}

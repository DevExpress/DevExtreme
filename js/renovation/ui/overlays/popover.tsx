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
import devices from '../../../core/devices';
import LegacyPopover from '../../../ui/popover';
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

export const viewFunction = ({
  wrapperRef,
  props,
  restAttributes,
}: Popover): JSX.Element => {
  const { children } = props;

  return (
    <DomComponentWrapper
      componentType={LegacyPopover}
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
export class PopoverProps extends BaseWidgetProps {
  @OneWay() animation?: {
    show: AnimationConfig;
    hide: AnimationConfig;
  } = {
    show: { type: 'fade', from: 0, to: 1 },
    hide: { type: 'fade', to: 0 },
  };

  @OneWay() closeOnOutsideClick: boolean | (() => boolean) = false;

  @OneWay() container?: string | Element;

  // contentComponent

  // contentRender

  @Template() contentTemplate: template | ((contentElement: DxElement) => string | UserDefinedElement) = 'content';

  @OneWay() deferRendering = true;

  @OneWay() disabled = false;

  @OneWay() elementAttr = {};

  @OneWay() height: number | string | (() => number | string) = 'auto';

  @OneWay() hideEvent?: string;

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

  @OneWay() toolbarItems?: ToolbarItem[];

  @OneWay() visible = false;

  @OneWay() width: number | string | (() => number | string) = 'auto';

  @Slot() children?: JSX.Element;
}
@Component({
  view: viewFunction,
})
export class Popover extends JSXComponent(PopoverProps) {
  @Ref() wrapperRef!: RefObject<DomComponentWrapper>;

  @Mutable() // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any;

  @Effect()
  saveInstance(): void {
    this.instance = this.wrapperRef.current?.getInstance();
  }
}

import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  JSXComponent,
  Method,
  OneWay,
  Ref,
  Template,
  Slot,
  RefObject,
} from '@devextreme-generator/declarations';
import { createDefaultOptionRules } from '../../core/options/utils';
import devices from '../../core/devices';
import { isMaterial, current } from '../../ui/themes';
import { click } from '../../events/short';
import { combineClasses } from '../utils/combine_classes';
import { getImageSourceType } from '../../core/utils/icon';
import { camelize } from '../../core/utils/inflector';
import { Icon } from './common/icon';
import errors from '../../core/errors';
import { InkRipple, InkRippleConfig } from './common/ink_ripple';
import { Widget } from './common/widget';
import { BaseWidgetProps } from './common/base_props';
// eslint-disable-next-line import/no-cycle
import BaseComponent from '../component_wrapper/button';
import messageLocalization from '../../localization/message';
import { EffectReturn } from '../utils/effect_return';

const stylingModes = ['outlined', 'text', 'contained'];

const getCssClasses = (model: ButtonProps): string => {
  const {
    text, icon, stylingMode, type, iconPosition,
  } = model;
  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    'dx-button': true,
    [`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`]: true,
    [`dx-button-${type ?? 'normal'}`]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left',
  };

  return combineClasses(classesMap);
};
export const viewFunction = (viewModel: Button): JSX.Element => {
  const {
    children, iconPosition, text,
    template: ButtonTemplate,
    iconTemplate: IconTemplate,
  } = viewModel.props;
  const renderText = !ButtonTemplate && !children && text !== '';
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !ButtonTemplate && !children && (viewModel.iconSource || IconTemplate)
        && (
        <Icon
          source={viewModel.iconSource}
          position={iconPosition}
          iconTemplate={IconTemplate}
        />
        );

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      aria={viewModel.aria}
      className={viewModel.props.className}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onActive={viewModel.onActive}
      onClick={viewModel.onWidgetClick}
      onInactive={viewModel.onInactive}
      onKeyDown={viewModel.keyDown}
      rtlEnabled={viewModel.props.rtlEnabled}
      tabIndex={viewModel.props.tabIndex}
      visible={viewModel.props.visible}
      width={viewModel.props.width}
      {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className="dx-button-content" ref={viewModel.contentRef}>
        {ButtonTemplate && (<ButtonTemplate data={viewModel.buttonTemplateData} />)}
        {!ButtonTemplate && children}
        {isIconLeft && iconComponent}
        {renderText && (<span className="dx-button-text">{text}</span>)}
        {!isIconLeft && iconComponent}
        {viewModel.props.useSubmitBehavior
                && <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input" />}
        {viewModel.props.useInkRipple
                && (
                <InkRipple
                  config={viewModel.inkRippleConfig}
                  ref={viewModel.inkRippleRef}
                />
                )}
      </div>
    </Widget>
  );
};

@ComponentBindings()
export class ButtonProps extends BaseWidgetProps {
  @OneWay() activeStateEnabled = true;

  @OneWay() hoverStateEnabled = true;

  @OneWay() icon = '';

  @OneWay() iconPosition?: string = 'left';

  @Event({
    actionConfig: { excludeValidators: ['readOnly'] },
  })
  onClick?: (e: { event: Event }) => void;

  @Event() onSubmit?: (e: { event: Event; submitInput: HTMLInputElement | null }) => void;

  @OneWay() pressed?: boolean;

  @OneWay() stylingMode: 'outlined' | 'text' | 'contained' = 'contained';

  @Template() template?: (props: { data: { icon?: string; text?: string } }) => JSX.Element;

  @Template() iconTemplate?: (props) => JSX.Element;

  @Slot() children?: JSX.Element;

  @OneWay() text = '';

  @OneWay() type: 'back' | 'danger' | 'default' | 'normal' | 'success' = 'normal';

  @OneWay() useInkRipple = false;

  @OneWay() useSubmitBehavior = false;

  @OneWay() templateData?: Record<string, unknown> = {};
}

export const defaultOptionRules = createDefaultOptionRules<ButtonProps>([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: { focusStateEnabled: true },
}, {
  // eslint-disable-next-line import/no-named-as-default-member
  device: (): boolean => isMaterial(current()),
  options: { useInkRipple: true },
}]);
@Component({
  defaultOptionRules,
  jQuery: {
    component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class Button extends JSXComponent(ButtonProps) {
  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() inkRippleRef!: RefObject<InkRipple>;

  @Ref() submitInputRef!: RefObject<HTMLInputElement>;

  @Ref() widgetRef!: RefObject<Widget>;

  @Method()
  focus(): void {
    this.widgetRef.current!.focus();
  }

  @Method()
  activate(): void {
    this.widgetRef.current!.activate();
  }

  @Method()
  deactivate(): void {
    this.widgetRef.current!.deactivate();
  }

  @Effect()
  submitEffect(): EffectReturn {
    const namespace = 'UIFeedback';
    const { useSubmitBehavior, onSubmit } = this.props;

    if (useSubmitBehavior && onSubmit) {
      click.on(this.submitInputRef.current,
        (event) => onSubmit({ event, submitInput: this.submitInputRef.current }),
        { namespace });

      return (): void => click.off(this.submitInputRef.current, { namespace });
    }

    return undefined;
  }

  @Effect()
  checkDeprecation(): void {
    const { type } = this.props;

    if (type === 'back') {
      errors.log('W0016', 'type', 'back', '22.2', 'Use the \'back\' icon instead');
    }
  }

  onActive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.current!.showWave({
      element: this.contentRef.current!, event,
    });
  }

  onInactive(event: Event): void {
    const { useInkRipple } = this.props;

    useInkRipple && this.inkRippleRef.current!.hideWave({
      element: this.contentRef.current!, event,
    });
  }

  onWidgetClick(event: Event): void {
    const {
      onClick,
      useSubmitBehavior,
    } = this.props;

    onClick?.({ event });
    useSubmitBehavior && this.submitInputRef.current!.click();
  }

  keyDown(e: {
    originalEvent: Event & { cancel: boolean };
    keyName: string;
    which: string;
  }): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = e;

    const result: Event & { cancel: boolean } = onKeyDown?.(e);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
      (originalEvent as Event).preventDefault();
      this.onWidgetClick(originalEvent as Event);
    }

    return undefined;
  }

  get aria(): Record<string, string> {
    const { text, icon } = this.props;

    let label = text ?? '';

    if (!text && icon) {
      const iconSource = getImageSourceType(icon);

      switch (iconSource) {
        case 'image': {
          const notURLRegexp = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
          const isPathToImage = !icon.includes('base64') && notURLRegexp.test(icon);
          label = isPathToImage ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : '';
          break;
        }
        case 'dxIcon':
          label = messageLocalization.format(camelize(icon, true)) || icon;
          break;
        case 'fontIcon': {
          const iconParts = icon.split(' ');
          label = iconParts[iconParts.length - 1];
          break;
        }
        case 'svg': {
          const titleRegexp = /<title>(.*?)<\/title>/;
          const title = titleRegexp.exec(icon)?.[1] ?? '';
          label = title;
          break;
        }
        default:
          break;
      }
    }

    return {
      role: 'button',
      ...label ? { label } : {},
    };
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get iconSource(): string {
    const { icon, type } = this.props;

    if (icon || type === 'back') {
      return (icon ?? '') || 'back';
    }

    return '';
  }

  get inkRippleConfig(): InkRippleConfig {
    const { text, icon, type } = this.props;
    return (!text && icon) || (type === 'back') ? {
      isCentered: true,
      useHoldAnimation: false,
      waveSizeCoefficient: 1,
    } : {};
  }

  get buttonTemplateData(): Record<string, unknown> {
    const { icon, text, templateData } = this.props;
    return { icon, text, ...templateData };
  }
}

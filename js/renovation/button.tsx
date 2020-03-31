import createDefaultOptionRules from '../core/options/utils';
import devices from '../core/devices';
import noop from './utils/noop';
import themes from '../ui/themes';
import { click } from '../events/short';
import { getImageSourceType } from '../core/utils/icon';
import { initConfig, showWave, hideWave } from '../ui/widget/utils.ink_ripple';
import { Component, ComponentBindings, Effect, JSXComponent, OneWay, Ref, Template, Event } from 'devextreme-generator/component_declaration/common';
import Icon from './icon';
import Widget, { WidgetInput } from './widget';

const defaultClassNames = ['dx-button'];
const stylingModes = ['outlined', 'text', 'contained'];

const getInkRippleConfig = ({ text, icon, type }: ButtonInput) => {
    const isOnlyIconButton = !text && icon || type === 'back';
    const config: any = isOnlyIconButton ? {
        isCentered: true,
        useHoldAnimation: false,
        waveSizeCoefficient: 1,
    } : {};

    return initConfig(config);
};

const getCssClasses = (model: ButtonInput) => {
    const { text, icon, stylingMode, type, iconPosition } = model;
    const classNames = defaultClassNames.concat(model.classNames || []);
    const isValidStylingMode = stylingMode && stylingModes.indexOf(stylingMode) !== -1;

    classNames.push(`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`);
    classNames.push(`dx-button-${type || 'normal'}`);

    text && classNames.push('dx-button-has-text');
    icon && classNames.push('dx-button-has-icon');
    iconPosition !== 'left' && classNames.push('dx-button-icon-right');

    return classNames.join(' ');
};

const getAriaLabel = (text, icon) => {
    let label = text && text.trim() || icon;

    if (!text && getImageSourceType(icon) === 'image') {
        label = icon.indexOf('base64') === -1 ? icon.replace(/.+\/([^.]+)\..+$/, '$1') : 'Base64';
    }

    return label ? { label } : {};
};

export const viewFunction = (viewModel: Button) => {
    const { icon, iconPosition, template, text } = viewModel.props;
    const renderText = !template && text;
    const isIconLeft = iconPosition === 'left';
    const leftIcon = !template && isIconLeft;
    const rightIcon = !template && !isIconLeft;
    const iconComponent = !template && viewModel.iconSource
        && <Icon source={viewModel.iconSource} position={iconPosition}/>;

    return <Widget
        accessKey={viewModel.props.accessKey}
        activeStateEnabled={viewModel.props.activeStateEnabled}
        aria={viewModel.aria}
        className={viewModel.cssClasses}
        disabled={viewModel.props.disabled}
        elementAttr={viewModel.elementAttr}
        focusStateEnabled={viewModel.props.focusStateEnabled}
        height={viewModel.props.height}
        hint={viewModel.props.hint}
        hoverStateEnabled={viewModel.props.hoverStateEnabled}
        onActive={viewModel.onActive}
        onContentReady={viewModel.props.onContentReady}
        onClick={viewModel.onWidgetClick}
        onInactive={viewModel.onInactive}
        onKeyPress={viewModel.onWidgetKeyPress}
        rtlEnabled={viewModel.props.rtlEnabled}
        tabIndex={viewModel.props.tabIndex}
        visible={viewModel.props.visible}
        width={viewModel.props.width}
    >
        <div className="dx-button-content" ref={viewModel.contentRef as any}>
            {template &&
                <viewModel.props.template
                    icon={icon}
                    text={text}
                    parentRef={viewModel.contentRef}
                />
            }
            {leftIcon && iconComponent}
            {renderText &&
                <span className="dx-button-text">{text}</span>
            }
            {rightIcon && iconComponent}
            {viewModel.props.useSubmitBehavior &&
                <input ref={viewModel.submitInputRef as any} type="submit" tabIndex={-1} className="dx-button-submit-input"/>
            }
        </div>
    </Widget>;
};

@ComponentBindings()
export class ButtonInput extends WidgetInput {
    @OneWay() activeStateEnabled?: boolean = true;
    @OneWay() classNames?: string[];
    @OneWay() hoverStateEnabled?: boolean = true;
    @OneWay() icon?: string = '';
    @OneWay() iconPosition?: string = 'left';
    @Event() onClick?: (e: any) => any = noop;
    @Event() onSubmit?: (e: any) => any = noop;
    @OneWay() pressed?: boolean;
    @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';
    @Template() template?: any = '';
    @OneWay() text?: string = '';
    @OneWay() type?: string;
    @OneWay() useInkRipple?: boolean = false;
    @OneWay() useSubmitBehavior?: boolean = false;
    @OneWay() validationGroup?: string = undefined;
}

const defaultOptionRules = createDefaultOptionRules<ButtonInput>([{
    device: () => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
    options: { focusStateEnabled: true },
}, {
    device: () => (themes as any).isMaterial(themes.current()),
    options: { useInkRipple: true },
}]);
// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionRules,
    view: viewFunction,
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() contentRef!: HTMLDivElement;
    @Ref() submitInputRef!: HTMLInputElement;

    @Effect()
    contentReadyEffect() {
        // NOTE: we should trigger this effect on change each
        //       property upon which onContentReady depends
        //       (for example, text, icon, etc)
        const { onContentReady } = this.props;

        onContentReady!({ element: this.contentRef.parentNode });
    }

    onActive(event: Event) {
        const { useInkRipple } = this.props;
        const config = getInkRippleConfig(this.props);

        useInkRipple && showWave(config, { element: this.contentRef, event });
    }

    onInactive(event: Event) {
        const { useInkRipple } = this.props;
        const config = getInkRippleConfig(this.props);

        useInkRipple && hideWave(config, { element: this.contentRef, event });
    }

    onWidgetClick(event: Event) {
        const { onClick, useSubmitBehavior, validationGroup } = this.props;

        onClick!({ event, validationGroup });
        useSubmitBehavior && this.submitInputRef.click();
    }

    onWidgetKeyPress(event: Event, { keyName, which }) {
        if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
            event.preventDefault();
            this.onWidgetClick(event);
        }
    }

    @Effect()
    submitEffect() {
        const namespace = 'UIFeedback';
        const { useSubmitBehavior, onSubmit } = this.props;

        if (useSubmitBehavior) {
            click.on(this.submitInputRef,
                event => onSubmit!({ event, submitInput: this.submitInputRef }),
                { namespace },
            );

            return () => click.off(this.submitInputRef, { namespace });
        }

        return null;
    }

    get aria() {
        return getAriaLabel(this.props.text, this.props.icon);
    }

    get cssClasses():string {
        return getCssClasses(this.props);
    }

    get elementAttr() {
        return { ...this.props.elementAttr, role: 'button' };
    }

    get iconSource(): string {
        const { icon, type } = this.props;

        return (icon || type === 'back') ? (icon || 'back') : '';
    }
}

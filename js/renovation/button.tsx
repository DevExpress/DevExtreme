import { click } from '../events/short';
import { initConfig, showWave, hideWave } from '../ui/widget/utils.ink_ripple';
import { Component, ComponentBindings, Effect, JSXComponent, OneWay, Ref } from 'devextreme-generator/component_declaration/common';
import { getImageSourceType } from '../core/utils/icon';
import Widget, { WidgetInput } from './widget';
import Icon from './icon';
import devices from '../core/devices';
import themes from '../ui/themes';
import createDefaultOptionRules from '../core/options/utils';

const stylingModes = ['outlined', 'text', 'contained'];
const defaultClassNames = ['dx-button'];

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

export const viewModelFunction = (model: Button):ButtonViewModel => {
    const props = model.props;
    return {
        ...props,
        aria: getAriaLabel(model.props.text, model.props.icon),
        contentRef: model.contentRef,
        cssClasses: getCssClasses(props),
        elementAttr: { ...props.elementAttr, role: 'button' },
        iconSource: (props.icon || props.type === 'back') ? (props.icon || 'back') : '',
        onActive: model.onActive,
        onInactive: model.onInactive,
        onWidgetClick: model.onWidgetClick,
        onWidgetKeyPress: model.onWidgetKeyPress,
        submitInputRef: model.submitInputRef,
    };
};

declare type ButtonViewModel = {
    contentRef: any;
    cssClasses: string;
    iconSource: string;
    onActive: (e: Event) => any;
    onInactive: (e: Event) => any;
    onWidgetClick: (e: Event) => any;
    onWidgetKeyPress: (e: Event, options:any) => void;
    submitInputRef: any;
} & ButtonInput;

export const viewFunction = (viewModel: ButtonViewModel) => {
    const renderText = !viewModel.contentRender && viewModel.text;
    const isIconLeft = viewModel.iconPosition === 'left';
    const leftIcon = !viewModel.contentRender && isIconLeft;
    const rightIcon = !viewModel.contentRender && !isIconLeft;
    const icon = !viewModel.contentRender && viewModel.iconSource
        && <Icon source={viewModel.iconSource} position={viewModel.iconPosition}/>;

    return <Widget
        accessKey={viewModel.accessKey}
        activeStateEnabled={viewModel.activeStateEnabled}
        aria={viewModel.aria}
        className={viewModel.cssClasses}
        disabled={viewModel.disabled}
        elementAttr={viewModel.elementAttr}
        focusStateEnabled={viewModel.focusStateEnabled}
        height={viewModel.height}
        hint={viewModel.hint}
        hoverStateEnabled={viewModel.hoverStateEnabled}
        onActive={viewModel.onActive}
        onClick={viewModel.onWidgetClick}
        onInactive={viewModel.onInactive}
        onKeyPress={viewModel.onWidgetKeyPress}
        rtlEnabled={viewModel.rtlEnabled}
        tabIndex={viewModel.tabIndex}
        visible={viewModel.visible}
        width={viewModel.width}
    >
        <div className="dx-button-content" ref={viewModel.contentRef}>
            {viewModel.contentRender &&
                <viewModel.contentRender
                    model={{
                        icon: viewModel.icon,
                        text: viewModel.text,
                    }}
                    parentRef={viewModel.contentRef}
                />
            }
            {leftIcon && icon}
            {renderText &&
                <span className="dx-button-text">{viewModel.text}</span>
            }
            {rightIcon && icon}
            {viewModel.useSubmitBehavior &&
                <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input"/>
            }
        </div>
    </Widget>;
};

@ComponentBindings()
export class ButtonInput extends WidgetInput {
    @OneWay() activeStateEnabled?: boolean = true;
    @OneWay() classNames?: string[];
    @OneWay() contentRender?: any;
    @OneWay() hoverStateEnabled?: boolean = true;
    @OneWay() icon?: string = '';
    @OneWay() iconPosition?: string = 'left';
    @OneWay() onSubmit?: (e: any) => any = (() => undefined);
    @OneWay() pressed?: boolean;
    @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';
    @OneWay() template?: any = '';
    @OneWay() text?: string = '';
    @OneWay() type?: string;
    @OneWay() useInkRipple?: boolean = false;
    @OneWay() useSubmitBehavior?: boolean = false;
}

const defaultOptionRules = createDefaultOptionRules<ButtonInput>([
    {
        device: () => devices.real().deviceType === 'desktop' && !(devices as any).isSimulator(),
        options: {
            focusStateEnabled: true,
        },
    },
    {
        device: () => (themes as any).isMaterial(themes.current()),
        options: { useInkRipple: true },
    },
]);
// tslint:disable-next-line: max-classes-per-file
@Component({
    defaultOptionsRules: defaultOptionRules,
    view: viewFunction,
    viewModel: viewModelFunction,
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() contentRef!: HTMLDivElement;
    @Ref() submitInputRef!: HTMLInputElement;

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

    onWidgetClick(e: Event) {
        const { onClick, useSubmitBehavior } = this.props;

        useSubmitBehavior && this.submitInputRef.click();

        return onClick?.(e);
    }

    onWidgetKeyPress(e: Event, { keyName, which }) {
        if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
            e.preventDefault();
            this.onWidgetClick(e);
        }
    }

    @Effect()
    submitEffect() {
        const namespace = 'UIFeedback';
        const { onSubmit } = this.props;

        click.on(this.submitInputRef, (e) => {
            onSubmit?.(e);
            e.stopPropagation();
        }, { namespace });

        return () => click.off(this.submitInputRef, { namespace });
    }
}

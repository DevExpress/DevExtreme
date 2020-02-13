import { click } from '../events/short';
import { getImageSourceType } from '../core/utils/icon';
import { initConfig, showWave, hideWave } from '../ui/widget/utils.ink_ripple';
import { Component, ComponentBindings, Effect, JSXComponent, OneWay, Ref } from 'devextreme-generator/component_declaration/common';
import Widget, { WidgetInput } from './widget';

const getImageContainerJSX = (source: string, position: string) => {
    const iconRightClass = position !== 'left' ? 'dx-icon-right' : '';

    switch (getImageSourceType(source)) {
        case 'dxIcon': return <i className={`dx-icon dx-icon-${source} ${iconRightClass}`}/>;
        case 'fontIcon': return <i className={`dx-icon ${source} ${iconRightClass}`}/>;
        case 'image': return <img src={source} className={`dx-icon ${iconRightClass}`}/>;
        case 'svg': return <i className={`dx-icon dx-svg-icon ${iconRightClass}`}>{source}></i>;
        default: return null;
    }
};

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

export const viewModelFunction = (model: Button):ButtonViewModel => {
    return {
        ...model.props,
        aria: { label: model.props.text && model.props.text.trim() },
        contentRef: model.contentRef,
        cssClasses: getCssClasses(model.props),
        elementAttr: { ...model.props.elementAttr, role: 'button' },
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
    onActive: (e: Event) => any;
    onInactive: (e: Event) => any;
    onWidgetClick: (e: Event) => any;
    onWidgetKeyPress: (e: Event, options:any) => void;
    submitInputRef: any;
} & ButtonInput;

export const viewFunction = (viewModel: ButtonViewModel) => {
    const isIconLeft = viewModel.iconPosition === 'left';
    let icon: any = viewModel.icon;

    if (icon || viewModel.type === 'back') {
        icon = getImageContainerJSX(icon || 'back', viewModel.iconPosition!);
    }

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
        {(viewModel.contentRender &&
            <viewModel.contentRender
                icon={viewModel.icon}
                text={viewModel.text}
                contentRef={viewModel.contentRef}
            >
                {viewModel.useSubmitBehavior &&
                    <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input"/>
                }
            </viewModel.contentRender>
        ) || (
            <div className="dx-button-content" ref={viewModel.contentRef}>
                {isIconLeft && icon}
                {viewModel.text &&
                    <span className="dx-button-text">{viewModel.text}</span>
                }
                {!isIconLeft && icon}
                {viewModel.useSubmitBehavior &&
                    <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input"/>
                }
            </div>
        )}
    </Widget>;
};

@ComponentBindings()
export class ButtonInput extends WidgetInput {
    @OneWay() activeStateEnabled?: boolean = true;
    @OneWay() classNames?: string[];
    @OneWay() contentRender?: ButtonTemplateFn;
    @OneWay() focusStateEnabled?: boolean = true;
    @OneWay() hoverStateEnabled?: boolean = true;
    @OneWay() icon?: string = '';
    @OneWay() iconPosition?: string = 'left';
    @OneWay() onSubmit?: (e: any) => any = (() => undefined);
    @OneWay() pressed?: boolean;
    @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';
    @OneWay() template?: ButtonTemplate = '';
    @OneWay() text?: string = '';
    @OneWay() type?: string;
    @OneWay() useInkRipple: boolean = false;
    @OneWay() useSubmitBehavior?: boolean = false;
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    components: [],
    name: 'Button',
    view: viewFunction,
    viewModel: viewModelFunction,
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() contentRef!: HTMLElement;
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

declare type ButtonContent = {
    text: string,
    icon: string,
};
declare type ButtonTemplateFn = (data: ButtonContent, container: any) => any;
declare type ButtonTemplate = ButtonTemplateFn | string;

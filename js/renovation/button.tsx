import { click } from '../events/short';
import { getImageSourceType } from '../core/utils/icon';
import { initConfig, showWave, hideWave } from '../ui/widget/utils.ink_ripple';
import { Component, ComponentBindings, Effect, JSXComponent, OneWay, Ref } from 'devextreme-generator/component_declaration/common';
import Widget, { WidgetInput } from './widget';

const getImageContainerJSX = (source: string) => {
    switch (getImageSourceType(source)) {
        case 'dxIcon': return <i className={`dx-icon dx-icon-${source}`}/>;
        case 'fontIcon': return <i className={`dx-icon ${source}`}/>;
        case 'image': return <img src={source} className="dx-icon"/>;
        case 'svg': return <i className="dx-icon dx-svg-icon">{source}></i>;
        default: return null;
    }
};

const stylingModes = ['outlined', 'text', 'contained'];
const defaultClassNames = ['dx-button'];

const getInkRippleConfig = ({ text, icon, type }) => {
    const isOnlyIconButton = !text && icon || type === 'back';

    return initConfig(isOnlyIconButton ? {
        isCentered: true,
        useHoldAnimation: false,
        waveSizeCoefficient: 1,
    } : {});
};

const getCssClasses = (model: ButtonInput) => {
    const { text, icon, stylingMode, type } = model;
    const classNames = defaultClassNames.concat(model.classNames || []);
    const isValidStylingMode = stylingMode && stylingModes.indexOf(stylingMode) !== -1;

    classNames.push(`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`);
    classNames.push(`dx-button-${type || 'normal'}`);

    text && classNames.push('dx-button-has-text');
    icon && classNames.push('dx-button-has-icon');

    return classNames.join(' ');
};

export const viewModelFunction = (model: Button):ButtonViewModel => {
    let icon: any = void 0;

    if (model.props.icon || model.props.type === 'back') {
        icon = getImageContainerJSX(model.props.icon || 'back');
    }

    return {
        ...model.props,
        aria: { label: model.props.text && model.props.text.trim() },
        contentRef: model.contentRef,
        cssClasses: getCssClasses(model.props),
        elementAttr: { ...model.props.elementAttr, role: 'button' },
        icon,
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
                <viewModel.contentRender icon={viewModel.icon} text={viewModel.text} />}
            {!viewModel.contentRender && viewModel.icon}
            {!viewModel.contentRender && viewModel.text &&
                <span className="dx-button-text">{viewModel.text}</span>
            }
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
    @OneWay() focusStateEnabled?: boolean = true;
    @OneWay() hoverStateEnabled?: boolean = true;
    @OneWay() icon?: string;
    @OneWay() onSubmit?: (e: any) => any = (() => undefined);
    @OneWay() pressed?: boolean;
    @OneWay() stylingMode?: 'outlined' | 'text' | 'contained';
    @OneWay() text?: string = '';
    @OneWay() type?: string;
    @OneWay() useInkRipple: boolean = false;
    @OneWay() useSubmitBehavior?: boolean = false;
}

/* tslint:disable-next-line:max-classes-per-file */
@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() contentRef!: HTMLDivElement;
    @Ref() submitInputRef!: HTMLInputElement;

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
}

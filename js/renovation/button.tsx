import { getImageSourceType } from '../core/utils/icon';
import { click } from '../events/short';
import { Component, Effect, Prop, React, Ref } from '../component_declaration/common';
import JSXConstructor from '../component_declaration/jsx';
import Widget from './widget';

const WidgetJSX = JSXConstructor<Widget>(Widget);

const getImageContainerJSX = (source: string) => {
    switch (getImageSourceType(source)) {
        case 'dxIcon': return (<i className={`dx-icon dx-icon-${source}`}/>);
        case 'fontIcon': return (<i className={`dx-icon ${source}`}/>);
        case 'image': return (<img src={source} className="dx-icon"/>);
        case 'svg': return (<i className="dx-icon dx-svg-icon">{source}></i>);
        default: return null;
    }
};

const stylingModes = ['outlined', 'text', 'contained'];
const defaultClassNames = ['dx-button'];

const getCssClasses = (model: any) => {
    const { text, icon, stylingMode, type } = model;
    const classNames = defaultClassNames.concat(model.classNames);
    const isValidStylingMode = stylingModes.indexOf(stylingMode) !== -1;

    classNames.push(`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`);
    classNames.push(`dx-button-${type || 'normal'}`);

    text && classNames.push('dx-button-has-text');
    icon && classNames.push('dx-button-has-icon');

    return classNames.join(' ');
};

export const viewModelFunction = (model: Button) => {
    let icon: any = void 0;

    if (model.icon || model.type === 'back') {
        icon = getImageContainerJSX(model.icon || 'back');
    }

    return {
        ...model,
        elementAttr: { ...model.elementAttr, role: 'button' },
        aria: { label: model.text && model.text.trim() },
        cssClasses: getCssClasses(model),
        icon,
    };
};

export const viewFunction = (viewModel: Button) => {
    const onClick = e => {
        viewModel.useSubmitBehavior && viewModel.submitInputRef.current.click();

        return viewModel.onClick?.(e);
    };

    const onKeyPress = (e, { keyName, which }) => {
        if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
            e.preventDefault();
            onClick(e);
        }
    };

    return <WidgetJSX
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
        onClick={onClick}
        onKeyPress={onKeyPress}
        rtlEnabled={viewModel.rtlEnabled}
        tabIndex={viewModel.tabIndex}
        visible={viewModel.visible}
        width={viewModel.width}
    >
        <div className="dx-button-content">
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
    </WidgetJSX>;
};

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends Widget {
    @Prop() activeStateEnabled?: boolean = true;
    @Prop() classNames?: string[];
    @Prop() contentRender?: ButtonTemplateFn;
    @Prop() focusStateEnabled?: boolean = true;
    @Prop() hoverStateEnabled?: boolean = true;
    @Prop() icon?: string;
    @Prop() onSubmit?: (e: any) => any = (() => undefined);
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() template?: ButtonTemplate = '';
    @Prop() text?: string = '';
    @Prop() type?: string;
    @Prop() useSubmitBehavior?: boolean = false;

    @Ref() submitInputRef!: HTMLInputElement;

    @Effect()
    submitEffect() {
        const namespace = 'UIFeedback';

        click.on(this.submitInputRef, e => {
            this.onSubmit?.(e);
            e.stopPropagation();
        }, { namespace });

        return () => click.off(this.widgetRef, { namespace });
    }
}

type ButtonContent = {
    text: string,
    icon: string,
}
type ButtonTemplateFn = (data: ButtonContent, container: any) => any
type ButtonTemplate = ButtonTemplateFn | string

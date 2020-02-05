import { getImageSourceType } from '../core/utils/icon';
import { click } from '../events/short';
import { Component, ComponentInput, Effect, Prop, Ref, JSXComponent } from 'devextreme-generator/component_declaration/common';
import Widget, { WidgetInput } from './widget';

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
        onWidgetClick: model.onWidgetClick,
        onWidgetKeyPress: model.onWidgetKeyPress,
        submitInputRef: model.submitInputRef,
        elementAttr: { ...model.props.elementAttr, role: 'button' },
        aria: { label: model.props.text && model.props.text.trim() },
        cssClasses: getCssClasses(model.props),
        icon,
    };
};

declare type ButtonViewModel = {
    cssClasses: string;
    submitInputRef: any;
    onWidgetClick: (e: Event) => any;
    onWidgetKeyPress: (e: Event, options:any) => void;
} & ButtonInput

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
        onClick={viewModel.onWidgetClick}
        onKeyPress={viewModel.onWidgetKeyPress}
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
    </Widget>;
};

@ComponentInput()
export class ButtonInput extends WidgetInput { 
    @Prop() activeStateEnabled?: boolean = true;
    @Prop() classNames?: string[];
    @Prop() contentRender?: any;
    @Prop() focusStateEnabled?: boolean = true;
    @Prop() hoverStateEnabled?: boolean = true;
    @Prop() icon?: string;
    @Prop() onSubmit?: (e: any) => any = (() => undefined);
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: 'outlined' | 'text' | 'contained';
    @Prop() text?: string = '';
    @Prop() type?: string;
    @Prop() useSubmitBehavior?: boolean = false;
}

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends JSXComponent<ButtonInput> {
    @Ref() submitInputRef!: HTMLInputElement;

    @Effect()
    submitEffect() {
        const namespace = 'UIFeedback';

        click.on(this.submitInputRef, e => {
            this.props.onSubmit?.(e);
            e.stopPropagation();
        }, { namespace });

        return () => click.off(this.submitInputRef, { namespace });
    }

    onWidgetClick(e:Event) { 
        this.props.useSubmitBehavior && this.submitInputRef.click();
        return this.props.onClick?.(e);
    }

    onWidgetKeyPress(e:Event, { keyName, which }){
        if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
            e.preventDefault();
            this.onWidgetClick(e);
        }
    }
}

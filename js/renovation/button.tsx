import { getImageSourceType } from '../core/utils/icon';
import { Component, ComponentInput, Prop, React, JSXComponent } from 'devextreme-generator/component_declaration/common';
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
    const supportedKeys = () => {
        const click = (e) => {
            e.preventDefault();
            model.props.onClick && model.props.onClick(e);
        };

        return { space: click, enter: click };
    };

    if (model.props.icon || model.props.type === 'back') {
        icon = getImageContainerJSX(model.props.icon || 'back');
    }

    return {
        ...model.props,
        elementAttr: { ...model.props.elementAttr, role: 'button' },
        aria: { label: model.props.text && model.props.text.trim() },
        cssClasses: getCssClasses(model.props),
        icon,
        supportedKeys,
    };
};

declare type ButtonViewModel = {
    cssClasses: string;
} & ButtonInput

export const viewFunction = (viewModel: ButtonViewModel) => (
    <Widget
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
        onClick={viewModel.onClick}
        rtlEnabled={viewModel.rtlEnabled}
        supportedKeys={viewModel.supportedKeys}
        tabIndex={viewModel.tabIndex}
        visible={viewModel.visible}
        width={viewModel.width}
    >
        {viewModel.contentRender && (
            <div className="dx-button-content">
                <viewModel.contentRender icon={viewModel.icon} text={viewModel.text} />
            </div>
        ) || (
            <div className="dx-button-content">
                {viewModel.icon}
                {viewModel.text && <span className="dx-button-text">{viewModel.text}</span>}
            </div>
        )}
    </Widget>
);

@ComponentInput()
export class ButtonInput extends WidgetInput { 
    @Prop() activeStateEnabled?: boolean = true;
    @Prop() classNames?: string[];
    @Prop() contentRender?: any;
    @Prop() focusStateEnabled?: boolean = true;
    @Prop() hoverStateEnabled?: boolean = true;
    @Prop() icon?: string;
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: 'outlined' | 'text' | 'contained';
    @Prop() text?: string;
    @Prop() type?: string;
}

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends JSXComponent<ButtonInput> {}

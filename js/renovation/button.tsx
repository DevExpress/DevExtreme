import { getImageSourceType } from '../core/utils/icon';
import { Component, Prop, React } from '../component_declaration/common';
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
}

export const viewModelFunction = (model: Button) => {
    let icon: any = void 0;
    const supportedKeys = () => {
        const click = (e) => {
            e.preventDefault();
            model.onClick && model.onClick(e);
        };

        return { space: click, enter: click };
    };

    if (model.icon || model.type === 'back') {
        icon = getImageContainerJSX(model.icon || 'back');
    }

    return {
        ...model,
        elementAttr: { ...model.elementAttr, role: 'button' },
        aria: { label: model.text && model.text.trim() },
        cssClasses: getCssClasses(model),
        icon,
        supportedKeys,
    };
};

export const viewFunction = (viewModel: Button) => (
    <WidgetJSX
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
    </WidgetJSX>
);

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends Widget {
    @Prop() classNames?: string[];
    @Prop() contentRender?: any;
    @Prop() icon?: string;
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() text?: string;
    @Prop() type?: string;
}

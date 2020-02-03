import { getImageSourceType } from '../core/utils/icon';
import { Component, Prop, React } from '../component_declaration/common';
import JSXConstructor from '../component_declaration/jsx';
import Widget from './widget';

const WidgetJSX = JSXConstructor<Widget>(Widget);

const getImageContainerJSX = (source: string, position: string) => {
    const iconRightClass = position !== 'left' ? 'dx-icon-right' : '';

    switch (getImageSourceType(source)) {
        case 'dxIcon': return (<i className={`dx-icon dx-icon-${source} ${iconRightClass}`}/>);
        case 'fontIcon': return (<i className={`dx-icon ${source} ${iconRightClass}`}/>);
        case 'image': return (<img src={source} className={`dx-icon ${iconRightClass}`}/>);
        case 'svg': return (<i className={`dx-icon dx-svg-icon ${iconRightClass}`}>{source}></i>);
        default: return null;
    }
};

const stylingModes = ['outlined', 'text', 'contained'];
const defaultClassNames = ['dx-button'];

const getCssClasses = (model: any) => {
    const { text, icon, stylingMode, type, iconPosition } = model;
    const classNames = defaultClassNames.concat(model.classNames);
    const isValidStylingMode = stylingModes.indexOf(stylingMode) !== -1;

    classNames.push(`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`);
    classNames.push(`dx-button-${type || 'normal'}`);

    text && classNames.push('dx-button-has-text');
    icon && classNames.push('dx-button-has-icon');
    iconPosition !== 'left' && classNames.push('dx-button-icon-right');

    return classNames.join(' ');
};

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
        icon = getImageContainerJSX(model.icon || 'back', model.iconPosition);
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

export const viewFunction = (viewModel: Button) => {
    const isIconLeft = viewModel.iconPosition === 'left';

    return (
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
            <div className="dx-button-content">
                {viewModel.contentRender && <viewModel.contentRender icon={viewModel.icon} text={viewModel.text} />}
                ||
                {isIconLeft && viewModel.icon}
                {viewModel.text && <span className="dx-button-text">{viewModel.text}</span>}
                {!isIconLeft && viewModel.icon}
            </div>
        </WidgetJSX>
    );
}

@Component({
    name: 'Button',
    components: [],
    viewModel: viewModelFunction,
    view: viewFunction,
})

export default class Button extends Widget {
    @Prop() activeStateEnabled?: boolean = true;
    @Prop() classNames?: string[];
    @Prop() contentRender?: any;
    @Prop() focusStateEnabled?: boolean = true;
    @Prop() hoverStateEnabled?: boolean = true;
    @Prop() icon?: String = '';
    @Prop() iconPosition?: string = 'left';
    @Prop() pressed?: boolean;
    @Prop() stylingMode?: string;
    @Prop() text?: string;
    @Prop() type?: string;
}

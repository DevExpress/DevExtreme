import { getImageSourceType } from '../core/utils/icon';
import { Component, ComponentBindings, JSXComponent, OneWay, Fragment } from 'devextreme-generator/component_declaration/common';

type IconViewModel = {
    cssClass: string;
    props: IconInput;
    sourceType: string;
};

export const viewModelFunction = (model: Icon): IconViewModel => {
    return {
        cssClass: model.props.position !== 'left' ? 'dx-icon-right' : '',
        props: model.props,
        sourceType: getImageSourceType(model.props.source),
    };
};

export const viewFunction = ({ sourceType, cssClass, props: { source } }: IconViewModel) => {
    return (<Fragment>
        {sourceType === 'dxIcon' && <i className={`dx-icon dx-icon-${source} ${cssClass}`}/>}
        {sourceType === 'fontIcon' && <i className={`dx-icon ${source} ${cssClass}`}/>}
        {sourceType === 'image' && <img src={source} className={`dx-icon ${cssClass}`}/>}
        {sourceType === 'svg' && <i className={`dx-icon dx-svg-icon ${cssClass}`}>{source}</i>}
    </Fragment>);
};

@ComponentBindings()
export class IconInput {
    @OneWay() position?: string = 'left';
    @OneWay() source?: string = '';
}

// tslint:disable-next-line: max-classes-per-file
@Component({
    components: [],
    view: viewFunction,
    viewModel: viewModelFunction,
})
export default class Icon extends JSXComponent<IconInput> {
    // get sourceType() {
    //     return getImageSourceType(this.props.source);
    // }

    // get cssClass() {
    //     return this.props.position !== 'left' ? 'dx-icon-right' : '';
    // }
}

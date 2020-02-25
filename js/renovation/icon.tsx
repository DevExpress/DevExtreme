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

export const viewFunction = (viewModel: IconViewModel) => {
    return (<Fragment>
        {viewModel.sourceType === 'dxIcon' &&
            <i className={`dx-icon dx-icon-${viewModel.props.source} ${viewModel.cssClass}`}/>
        }
        {viewModel.sourceType === 'fontIcon' &&
            <i className={`dx-icon ${viewModel.props.source} ${viewModel.cssClass}`}/>
        }
        {viewModel.sourceType === 'image' &&
            <img src={viewModel.props.source} className={`dx-icon ${viewModel.cssClass}`}/>
        }
        {viewModel.sourceType === 'svg' &&
            <i className={`dx-icon dx-svg-icon ${viewModel.cssClass}`}>{viewModel.props.source}</i>
        }
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

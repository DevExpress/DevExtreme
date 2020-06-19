/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { getImageSourceType } from '../core/utils/icon';

export const viewFunction = ({ sourceType, cssClass, props: { source } }: Icon) => (
  <Fragment>
    {sourceType === 'dxIcon' && <i className={`dx-icon dx-icon-${source} ${cssClass}`} />}
    {sourceType === 'fontIcon' && <i className={`dx-icon ${source} ${cssClass}`} />}
    {sourceType === 'image' && <img alt="" src={source} className={`dx-icon ${cssClass}`} />}
    {sourceType === 'svg' && <i className={`dx-icon dx-svg-icon ${cssClass}`}>{source}</i>}
  </Fragment>
);

@ComponentBindings()
export class IconProps {
  @OneWay() position?: string = 'left';

  @OneWay() source?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class Icon extends JSXComponent(IconProps) {
  get sourceType() {
    return getImageSourceType(this.props.source);
  }

  get cssClass() {
    return this.props.position !== 'left' ? 'dx-icon-right' : '';
  }
}

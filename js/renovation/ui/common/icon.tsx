import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from '@devextreme-generator/declarations';
import { getImageSourceType } from '../../../core/utils/icon';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = ({
  sourceType,
  iconClassName,
  props: { source, iconTemplate: IconTemplate },
}: Icon): JSX.Element => (
  <Fragment>
    {sourceType === 'dxIcon' && (<i className={iconClassName} />)}
    {sourceType === 'fontIcon' && (<i className={iconClassName} />)}
    {sourceType === 'image' && (<img className={iconClassName} alt="" src={source} />)}
    {IconTemplate && (<i className={iconClassName}><IconTemplate /></i>)}
  </Fragment>
);

@ComponentBindings()
export class IconProps {
  @OneWay() position?: string = 'left';

  @OneWay() source?: string = '';

  @Template() iconTemplate?: (props) => JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Icon extends JSXComponent(IconProps) {
  get sourceType(): string | false {
    return getImageSourceType(this.props.source);
  }

  get cssClass(): string {
    return this.props.position !== 'left' ? 'dx-icon-right' : '';
  }

  get iconClassName(): string {
    const generalClasses = {
      'dx-icon': true,
      [this.cssClass]: !!this.cssClass,
    };
    const { source } = this.props;

    if (this.sourceType === 'dxIcon') {
      return combineClasses({ ...generalClasses, [`dx-icon-${source}`]: true });
    }
    if (this.sourceType === 'fontIcon') {
      return combineClasses({ ...generalClasses, [String(source)]: !!source });
    }
    if (this.sourceType === 'image') {
      return combineClasses(generalClasses);
    }
    if (this.sourceType === 'svg') {
      return combineClasses({ ...generalClasses, 'dx-svg-icon': true });
    }
    return '';
  }
}

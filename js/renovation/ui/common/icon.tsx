import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from '@devextreme-generator/declarations';
import { getImageSourceType } from '../../../core/utils/icon';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = ({
  sourceType,
  cssClass,
  props: { source },
}: Icon): JSX.Element => {
  const generalClasses = {
    'dx-icon': true,
    [cssClass]: !!cssClass,
  };

  return (
    <Fragment>
      {sourceType === 'dxIcon' && (
        <i className={combineClasses({ ...generalClasses, [`dx-icon-${source}`]: true })} />
      )}
      {sourceType === 'fontIcon' && (
        <i className={combineClasses({ ...generalClasses, [String(source)]: !!source })} />
      )}
      {sourceType === 'image' && (
        <img className={combineClasses(generalClasses)} alt="" src={source} />
      )}
      {sourceType === 'svg' && (
        <i className={combineClasses({ ...generalClasses, 'dx-svg-icon': true })}>{source}</i>
      )}
    </Fragment>
  );
};

@ComponentBindings()
export class IconProps {
  @OneWay() position?: string = 'left';

  @OneWay() source?: string = '';
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
}

import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getImageSourceType } from '@js/core/utils/icon';
import { getTemplate } from '@ts/core/r1/utils/index';
import { combineClasses } from '@ts/core/utils/combine_classes';

export interface IconProps {
  position?: string;

  source?: string;

  iconTemplate?: (props) => JSX.Element;
}

export const defaultIconProps = {
  position: 'left',
  source: '',
};

export class Icon extends BaseInfernoComponent<IconProps> {
  constructor(props: IconProps) {
    super(props);
    this.state = {};
  }

  get sourceType(): false | 'svg' | 'image' | 'dxIcon' | 'fontIcon' {
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

  get restAttributes(): Record<string, unknown> {
    const restProps = { ...this.props };

    ['iconTemplate', 'position', 'source'].forEach((excluded) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete restProps[excluded];
    });

    return restProps;
  }

  render(): JSX.Element {
    const {
      iconClassName,
      props: {
        source,
      },
      sourceType,
    } = this;

    const IconTemplate = getTemplate(this.props.iconTemplate);

    return (
      <>
        {sourceType === 'dxIcon' && (<i className={iconClassName} />)}
        {sourceType === 'fontIcon' && (<i className={iconClassName} />)}
        {sourceType === 'image' && (<img className={iconClassName} alt="" src={source} />)}
        {IconTemplate && (<i className={iconClassName}><IconTemplate /></i>)}
      </>
    );
  }
}
Icon.defaultProps = defaultIconProps;

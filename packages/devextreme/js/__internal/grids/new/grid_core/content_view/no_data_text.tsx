import type { ComponentType, InfernoNode } from 'inferno';
import { Component } from 'inferno';

import { Icon } from '../icon';

export interface NoDataTextProperties {
  text: string;
  template?: ComponentType<{ text: string }>;
}

export const CLASSES = {
  container: 'dx-gridcore-nodata-container',
  element: 'dx-gridcore-nodata-element',
  iconContainer: 'dx-gridcore-nodata-icon-container',
  text: 'dx-gridcore-nodata-text',
};

export class NoDataText extends Component<NoDataTextProperties> {
  public render(): InfernoNode {
    const Template = this.props.template;

    return (
      <div className={CLASSES.container}>
        {Template ? (
          <Template text={this.props.text} />
        ) : (
          <div className={CLASSES.element}>
            <div className={CLASSES.iconContainer}>
              <Icon name='cardcontent'/>
            </div>
            <div className={CLASSES.text}>
              { this.props.text }
            </div>
          </div>
        )}
      </div>
    );
  }
}

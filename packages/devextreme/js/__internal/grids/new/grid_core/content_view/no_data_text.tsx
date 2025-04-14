import type { ComponentType, InfernoNode } from 'inferno';
import { Component } from 'inferno';

export interface NoDataTextProperties {
  text: string;
  template?: ComponentType<{ text: string }>;
}

export const CLASSES = {
  noData: 'dx-gridcore-nodata',
};

export class NoDataText extends Component<NoDataTextProperties> {
  public render(): InfernoNode {
    if (this.props.template) {
      const Template = this.props.template;
      return <Template text={this.props.text} />;
    }

    return (
      <span className={CLASSES.noData}>
        { this.props.text }
      </span>
    );
  }
}

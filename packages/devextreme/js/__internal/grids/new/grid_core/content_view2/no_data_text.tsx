import { Component, type InfernoNode } from 'inferno';

export interface NoDataTextProperties {
  text?: string;
}

export const CLASSES = {
  noData: 'dx-gridcore-nodata',
};

export class NoDataText extends Component<NoDataTextProperties> {
  public render(): InfernoNode {
    return <span className={CLASSES.noData}>
      { this.props.text ?? 'No Data'}
    </span>;
  }
}

import { Component, type InfernoNode } from 'inferno';

export interface NoDataProperties {
  text?: string;
}

export const CLASSES = {
  noData: 'dx-gridcore-nodata',
};

export class NoData extends Component<NoDataProperties> {
  public render(): InfernoNode {
    return <span className={CLASSES.noData}>
      { this.props.text ?? 'No Data'}
    </span>;
  }
}

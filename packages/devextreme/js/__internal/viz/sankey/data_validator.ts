import graphModule from './graph';
import type { SankeyDataItem } from './sankey';

interface DataValidator {
  validate: (
    data: SankeyDataItem[],
    incidentOccurred: (errorCode: string) => void,
  ) => string | null;
  _hasCycle: (data: SankeyDataItem[]) => boolean;
}

const validator: DataValidator = {
  validate(
    this: DataValidator,
    data: SankeyDataItem[],
    incidentOccurred: (errorCode: string) => void,
  ): string | null {
    let result: string | null = null;
    if (this._hasCycle(data)) {
      result = 'E2006';
      incidentOccurred('E2006');
    }
    return result;
  },
  _hasCycle(data: SankeyDataItem[]): boolean {
    return graphModule.struct.hasCycle(data);
  },
};

export default validator;

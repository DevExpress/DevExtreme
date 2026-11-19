import graphModule from './graph';
import type { SankeyDataItem } from './sankey';

const validator = {
  validate(data: SankeyDataItem[], incidentOccurred: (errorCode: string) => void): string | null {
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

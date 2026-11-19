import type { GraphLink } from './graph';
import graphModule from './graph';

const validator = {
  validate(data: GraphLink[], incidentOccurred: (errorCode: string) => void): string | null {
    let result: string | null = null;
    if (this._hasCycle(data)) {
      result = 'E2006';
      incidentOccurred('E2006');
    }
    return result;
  },
  _hasCycle(data: GraphLink[]): boolean {
    return graphModule.struct.hasCycle(data);
  },
};

export default validator;

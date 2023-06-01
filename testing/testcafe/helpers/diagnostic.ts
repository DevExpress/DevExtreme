/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { ClientFunction } from 'testcafe';

export const getRenderCount = (key: string): Promise<number> => {
  const result = ClientFunction(() => {
    const { dxDiagnostic } = window as any;

    return dxDiagnostic && dxDiagnostic[key]
      ? dxDiagnostic[key].renderCount
      : -1;
  }, {
    dependencies: {
      key,
    },
  })();

  return result;
};

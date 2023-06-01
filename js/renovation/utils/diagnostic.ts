/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWindow } from '../../core/utils/window';

interface Diagnostic {
  renderCount: number;
}
type DiagnosticMapType = Record<string, Diagnostic>;
interface IDiagnosticWindow {
  dxDiagnostic: DiagnosticMapType;
}

/* istanbul ignore next - Test utils */
export const DiagnosticUtils = {
  resolveMap: (): DiagnosticMapType => {
    const diagnosticWindow = getWindow() as unknown as IDiagnosticWindow;

    if (!diagnosticWindow.dxDiagnostic) {
      diagnosticWindow.dxDiagnostic = {};
    }

    return diagnosticWindow.dxDiagnostic;
  },

  getDiagnostic: (key: string): Diagnostic => {
    const diagnosticMap = DiagnosticUtils.resolveMap();

    if (!diagnosticMap[key]) {
      diagnosticMap[key] = { renderCount: 0 };
    }

    return diagnosticMap[key];
  },

  incrementRenderCount: (key: string): void => {
    const diagnostic = DiagnosticUtils.getDiagnostic(key);
    diagnostic.renderCount += 1;
  },
};

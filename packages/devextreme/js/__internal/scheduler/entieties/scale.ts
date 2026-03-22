import type { Rect } from '../appointments/resizing/types';
import { isDateAndTimeView } from '../r1/utils/index';
import type { ViewDataProviderType } from '../types';

export interface DOMElementsMetaData {
  dateTableCellsMeta: Rect[][];
  allDayPanelCellsMeta: Rect[];
}

interface Workspace {
  positionHelper: {
    getResizableStep: () => number;
  };
  getDOMElementsMetaData: () => DOMElementsMetaData;
  viewDataProvider: ViewDataProviderType;
  isVerticalGroupedWorkSpace: () => boolean;
  type: string;
}

export interface Scale {
  readonly viewDataProvider: ViewDataProviderType | undefined;
  getResizableStep: () => number;
  getDOMElementsMetaData: () => DOMElementsMetaData | undefined;
  isVerticalGroupedWorkSpace: () => boolean;
  isDateAndTimeView: () => boolean;
}

export class WorkspaceScale implements Scale {
  private readonly getWorkspace: () => Workspace | undefined;

  constructor(getWorkspace: () => Workspace | undefined) {
    this.getWorkspace = getWorkspace;
  }

  get viewDataProvider(): ViewDataProviderType | undefined {
    return this.getWorkspace()?.viewDataProvider;
  }

  getResizableStep(): number {
    const workspace = this.getWorkspace();
    return workspace ? workspace.positionHelper.getResizableStep() : 0;
  }

  getDOMElementsMetaData(): DOMElementsMetaData | undefined {
    return this.getWorkspace()?.getDOMElementsMetaData();
  }

  isVerticalGroupedWorkSpace(): boolean {
    return this.getWorkspace()?.isVerticalGroupedWorkSpace() ?? false;
  }

  isDateAndTimeView(): boolean {
    const workspace = this.getWorkspace();
    if (!workspace) return false;
    return isDateAndTimeView(workspace.type as Parameters<typeof isDateAndTimeView>[0]);
  }
}

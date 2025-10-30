/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GridBase } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ToastModel } from '@ts/ui/__tests__/__mock__/model/toast';

import { AIPromptEditorModel } from './ai_prompt_editor';
import { HeaderCellModel } from './header_cell';

const SELECTORS = {
  headerRowClass: 'dx-header-row',
  dataRowClass: 'dx-data-row',
  groupRowClass: 'dx-group-row',
  aiDialog: 'dx-aidialog',
  aiPromptEditor: 'dx-ai-prompt-editor',
  toast: 'dx-toast',
};

export abstract class GridCoreModel<TInstance extends GridBase = GridBase> {
  constructor(protected readonly root: HTMLElement) {}

  public getHeaderCells(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.headerRowClass} > td`);
  }

  public getHeaderCell(columnIndex: number): HeaderCellModel {
    return new HeaderCellModel(this.getHeaderCells()[columnIndex]);
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`)[rowIndex]?.querySelectorAll('td')[columnIndex] as HTMLElement;
  }

  public getGroupRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupRowClass}`);
  }

  public apiColumnOption(id: string, name?: string, value?: any): any {
    switch (arguments.length) {
      case 1:
        return this.getInstance().columnOption(id);
      case 2:
        return this.getInstance().columnOption(id, name);
      default:
        this.getInstance().columnOption(id, name as string, value);
        return undefined;
    }
  }

  public getHeaderByText(text: string): dxElementWrapper {
    return $(Array.from(this.getHeaderCells()).find((el) => $(el).text().includes(text)));
  }

  public getAIDialog(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.aiDialog}`) as HTMLElement;
  }

  private getPromptEditorContainer(): HTMLElement {
    return this.root.querySelector(`.${SELECTORS.aiPromptEditor}`) as HTMLElement;
  }

  public getAIPromptEditor(): AIPromptEditorModel {
    return new AIPromptEditorModel(this.getPromptEditorContainer());
  }

  private getToastContainer(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.toast}`) as HTMLElement;
  }

  public getToast(): ToastModel {
    return new ToastModel(this.getToastContainer());
  }

  public abstract getInstance(): TInstance;
}

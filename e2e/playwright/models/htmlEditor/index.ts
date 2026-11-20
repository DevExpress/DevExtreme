import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Button from '../button';
import AIDialog from './aiDialog';
import Dialog from './dialog';

const CLASS = {
  content: 'dx-htmleditor-content',
  toolbar: 'dx-htmleditor-toolbar',
};

type ToolbarItemName = 'image' | 'color' | 'link' | 'ai' | 'bold';

export default class HtmlEditor extends Widget {
  name: WidgetName = 'dxHtmlEditor';

  public readonly content: Locator;

  public readonly dialog: Dialog;

  public readonly aiDialog: AIDialog;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.content = this.element.locator(`.${CLASS.content}`);
    this.dialog = new Dialog(page);
    this.aiDialog = new AIDialog(page);
  }

  public async expectImageLoaded(src?: string): Promise<void> {
    const image = this.content.locator('img');

    if (src !== undefined) {
      await expect(image).toHaveAttribute('src', src);
    }

    await expect.poll(() => image.evaluate(
      (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
    )).toBe(true);
  }

  public getToolbarItem(name: ToolbarItemName): Button {
    return new Button(this.page, this.element.locator(`.${CLASS.toolbar} .dx-${name}-format`));
  }
}

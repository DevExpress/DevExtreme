import type dxTagBox from '@js/ui/tag_box';
import TagBox from '@js/ui/tag_box';

const TAG_CLASS = 'dx-tag';

export class TagBoxModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): dxTagBox {
    return TagBox.getInstance(this.root) as dxTagBox;
  }

  public getValue(): (string | number)[] {
    return this.getInstance().option('value') as (string | number)[];
  }

  public setValue(value: (string | number)[]): void {
    this.getInstance().option('value', value);
  }

  public getInput(): HTMLInputElement {
    return this.root.querySelector('input') as HTMLInputElement;
  }

  public getTags(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${TAG_CLASS}`);
  }
}

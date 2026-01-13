import CheckBox from '@js/ui/check_box';

export class CheckBoxModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): CheckBox {
    return CheckBox.getInstance(this.root) as CheckBox;
  }

  public toggle(): void {
    const instance = this.getInstance();
    const currentValue = instance.option('value');
    instance.option('value', !currentValue);
  }
}

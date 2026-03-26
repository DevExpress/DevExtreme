import type { Page, Locator } from '@playwright/test';

const CLASS = {
  item: 'dx-list-item',
  group: 'dx-list-group',
  groupHeader: 'dx-list-group-header',
  search: 'dx-list-search',
  selectAllItem: 'dx-list-select-all',
  invisible: 'dx-state-invisible',
  focused: 'dx-state-focused',
  selected: 'dx-list-item-selected',
  hovered: 'dx-state-hover',
  disabled: 'dx-state-disabled',
  checkbox: 'dx-checkbox',
  checkboxChecked: 'dx-checkbox-checked',
  checkboxIndeterminate: 'dx-checkbox-indeterminate',
  radioButton: 'dx-radiobutton',
  radioButtonChecked: 'dx-radiobutton-checked',
  reorderHandle: 'dx-list-reorder-handle',
  nestedItem: 'nested-item',
} as const;

export class ListItemCheckBox {
  readonly element: Locator;

  constructor(itemElement: Locator) {
    this.element = itemElement.locator(`.${CLASS.checkbox}`);
  }

  get isChecked(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.checkboxChecked,
    );
  }

  get isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, focusCls) => {
        let node: Element | null = el;
        while (node) {
          if (node.classList.contains(focusCls)) return true;
          if (node.classList.contains('dx-list-item') || node.classList.contains('dx-list-select-all')) break;
          node = node.parentElement;
        }
        return false;
      },
      CLASS.focused,
    );
  }

  get isIndeterminate(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.checkboxIndeterminate,
    );
  }
}

export class ListItemRadioButton {
  readonly element: Locator;

  constructor(itemElement: Locator) {
    this.element = itemElement.locator(`.${CLASS.radioButton}`);
  }

  get isChecked(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.radioButtonChecked,
    );
  }

  get isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }
}

export class ListItem {
  readonly element: Locator;
  readonly checkBox: ListItemCheckBox;
  readonly radioButton: ListItemRadioButton;
  readonly reorderHandle: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.checkBox = new ListItemCheckBox(element);
    this.radioButton = new ListItemRadioButton(element);
    this.reorderHandle = element.locator(`.${CLASS.reorderHandle}`);
  }

  get isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  get isSelected(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.selected,
    );
  }

  get isHovered(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.hovered,
    );
  }

  get isDisabled(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.disabled,
    );
  }

  get text(): Promise<string> {
    return this.element.textContent().then((t) => t ?? '');
  }
}

export class ListGroup {
  readonly element: Locator;
  readonly header: Locator;
  readonly items: Locator;

  constructor(element: Locator) {
    this.element = element;
    this.header = element.locator(`.${CLASS.groupHeader}`);
    this.items = element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  getItem(index = 0): ListItem {
    return new ListItem(this.items.nth(index));
  }
}

export class List {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly searchInput: Locator;
  readonly selectAll: ListItem;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.searchInput = this.element.locator(`.${CLASS.search} input`);
    this.selectAll = new ListItem(this.element.locator(`.${CLASS.selectAllItem}`));
  }

  getItem(index = 0): ListItem {
    return new ListItem(this.getItems().nth(index));
  }

  getItems(): Locator {
    return this.element.locator(`.${CLASS.item}:not(.${CLASS.nestedItem})`);
  }

  getVisibleItems(): Locator {
    return this.element.locator(`.${CLASS.item}:not(.${CLASS.invisible})`);
  }

  getGroup(index = 0): ListGroup {
    return new ListGroup(this.element.locator(`.${CLASS.group}`).nth(index));
  }

  async scrollTo(value: number): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ sel: s, val }) => {
        ($(s) as any).dxList('instance').scrollTo(val);
      },
      { sel, val: value },
    );
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxList('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxList('instance').option(n),
      { sel, name },
    );
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxList('instance').focus(); },
      sel,
    );
  }

  async repaint(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      (s) => { ($(s) as any).dxList('instance').repaint(); },
      sel,
    );
  }
}

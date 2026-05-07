import type { TextEditorButton as PublicTextEditorButton, TextEditorButtonLocation } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type dxButton from '@js/ui/button';
import errors from '@js/ui/widget/ui.errors';

import type TextEditorBase from '../m_text_editor.base';
import type TextEditorButton from './m_button';
import CustomButton from './m_custom';

const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = 'dx-texteditor-buttons-container';

function checkButtonInfo(buttonInfo: PublicTextEditorButton): void {
  const checkButtonType = (): void => {
    if (!buttonInfo || typeof buttonInfo !== 'object' || Array.isArray(buttonInfo)) {
      throw errors.Error('E1053');
    }
  };

  const checkLocation = (): void => {
    const { location } = buttonInfo;

    if ('location' in buttonInfo && location !== 'after' && location !== 'before') {
      buttonInfo.location = 'after';
    }
  };

  const checkNameIsDefined = (): void => {
    if (!('name' in buttonInfo)) {
      throw errors.Error('E1054');
    }
  };

  const checkNameIsString = (): void => {
    const { name } = buttonInfo;

    if (typeof name !== 'string') {
      throw errors.Error('E1055');
    }
  };

  checkButtonType();
  checkNameIsDefined();
  checkNameIsString();
  checkLocation();
}

function checkNamesUniqueness(
  existingNames: (string | PublicTextEditorButton)[],
  newName: string | PublicTextEditorButton,
): void {
  if (existingNames.includes(newName)) {
    throw errors.Error('E1055', newName);
  }

  existingNames.push(newName);
}

function isPredefinedButtonName(
  name: string | undefined,
  predefinedButtonsInfo: PublicTextEditorButton[],
): boolean {
  return !!predefinedButtonsInfo.find((info) => info.name === name);
}

export type TextEditorButtonInfo = PublicTextEditorButton & { Ctor: CustomButton };

export default class TextEditorButtonCollection<
  TComponent extends TextEditorBase = TextEditorBase,
> {
  buttons!: TextEditorButton[];

  editor!: TComponent;

  defaultButtonsInfo!: TextEditorButtonInfo[];

  constructor(editor: TComponent, defaultButtonsInfo: TextEditorButtonInfo[]) {
    this.buttons = [];
    this.defaultButtonsInfo = defaultButtonsInfo;
    this.editor = editor;
  }

  _compileButtonInfo(
    buttons: (string | PublicTextEditorButton)[],
  ): TextEditorButtonInfo[] {
    const names: (string | TextEditorButtonInfo)[] = [];

    return buttons.map((button) => {
      const isStringButton = typeof button === 'string';

      if (!isStringButton) {
        checkButtonInfo(button);
      }
      const isDefaultButton = isStringButton
        || isPredefinedButtonName(button.name, this.defaultButtonsInfo);

      if (isDefaultButton) {
        const defaultButtonInfo = this.defaultButtonsInfo.find(
          // @ts-expect-error ts-error
          ({ name }) => name === button || name === button.name,
        );

        if (!defaultButtonInfo) {
          throw errors.Error('E1056', this.editor.NAME, button);
        }

        checkNamesUniqueness(names, button);

        return defaultButtonInfo;
      }
      const { name } = button;
      // @ts-expect-error @ts-error
      checkNamesUniqueness(names, name);

      return { ...button, Ctor: CustomButton } as unknown as TextEditorButtonInfo;
    });
  }

  _createButton(buttonsInfo: TextEditorButtonInfo): TextEditorButton {
    const { Ctor, options, name } = buttonsInfo;
    // @ts-expect-error ts-error
    const button: TextEditorButton = new Ctor(name, this.editor, options);

    this.buttons.push(button);

    return button;
  }

  _renderButtons(
    buttons: (string | PublicTextEditorButton)[] | undefined,
    $container: dxElementWrapper,
    targetLocation: TextEditorButtonLocation,
  ): dxElementWrapper | null {
    let $buttonsContainer: dxElementWrapper | null = null;
    const buttonsInfo = buttons ? this._compileButtonInfo(buttons) : this.defaultButtonsInfo;
    const getButtonsContainer = (): dxElementWrapper => {
      $buttonsContainer = $buttonsContainer ?? $('<div>')
        .addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS);

      if (targetLocation === 'before') {
        $container.prepend($buttonsContainer);
      } else {
        $container.append($buttonsContainer);
      }

      return $buttonsContainer;
    };

    buttonsInfo.forEach((buttonInfo) => {
      const { location = 'after' } = buttonInfo;

      if (location === targetLocation) {
        this._createButton(buttonInfo)
          .render(getButtonsContainer());
      }
    });

    return $buttonsContainer;
  }

  clean(): void {
    this.buttons.forEach((button) => button.dispose());
    this.buttons = [];
  }

  getButton(buttonName: string): dxElementWrapper | dxButton | null | undefined {
    const button = this.buttons.find(({ name }) => name === buttonName);

    return button?.instance;
  }

  renderAfterButtons(
    buttons: (string | PublicTextEditorButton)[] | undefined,
    $container: dxElementWrapper,
  ): dxElementWrapper | null {
    return this._renderButtons(buttons, $container, 'after');
  }

  renderBeforeButtons(
    buttons: (string | PublicTextEditorButton)[] | undefined,
    $container: dxElementWrapper,
  ): dxElementWrapper | null {
    return this._renderButtons(buttons, $container, 'before');
  }

  updateButtons(names?: string[]): void {
    this.buttons.forEach((button) => {
      if (!names || names.includes(button.name)) {
        button.update();
      }
    });
  }
}

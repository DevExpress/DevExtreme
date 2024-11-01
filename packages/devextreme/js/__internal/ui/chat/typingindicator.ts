import messageLocalization from '@js/common/core/localization/message';
import type { Properties as DOMComponentProperties } from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { User } from '@js/ui/chat';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

const CHAT_TYPINGINDICATOR_CLASS = 'dx-chat-typingindicator';
const CHAT_TYPINGINDICATOR_CONTENT_CLASS = 'dx-chat-typingindicator-content';
const CHAT_TYPINGINDICATOR_TEXT_CLASS = 'dx-chat-typingindicator-text';
const CHAT_TYPINGINDICATOR_BUBBLE_CLASS = 'dx-chat-typingindicator-bubble';
const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';

export interface Properties extends DOMComponentProperties {
  typingUsers: User[];
}

class TypingIndicator extends DOMComponent<TypingIndicator, Properties> {
  private _$content?: dxElementWrapper;

  private _$text?: dxElementWrapper;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      typingUsers: [],
    } as Properties;
  }

  _init(): void {
    super._init();

    $(this.element()).addClass(CHAT_TYPINGINDICATOR_CLASS);
  }

  _initMarkup(): void {
    super._initMarkup();

    const { typingUsers } = this.option();

    if (typingUsers?.length) {
      this._renderContent();
    }
  }

  _renderContent(): void {
    this._renderContentElement();
    this._renderTextElement();
    this._updateText();
    this._renderBubble();
  }

  _renderContentElement(): void {
    this._$content = $('<div>')
      .addClass(CHAT_TYPINGINDICATOR_CONTENT_CLASS)
      .appendTo(this.element());
  }

  _renderTextElement(): void {
    if (this._$content) {
      this._$text = $('<div>')
        .addClass(CHAT_TYPINGINDICATOR_TEXT_CLASS)
        .appendTo(this._$content);
    }
  }

  _renderBubble(): void {
    if (this._$content) {
      const $bubble = $('<div>').addClass(CHAT_TYPINGINDICATOR_BUBBLE_CLASS);

      new Array(3).fill(0).forEach(() => {
        $('<div>')
          .addClass(CHAT_TYPINGINDICATOR_CIRCLE_CLASS)
          .appendTo($bubble);
      });

      $bubble.appendTo(this._$content);
    }
  }

  _getText(): string {
    const { typingUsers } = this.option();

    const usernames = typingUsers?.map((user) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const name = user.name?.trim() || messageLocalization.format('dxChat-defaultUserName');

      return name;
    });

    if (usernames?.length === 1) {
      const username = usernames[0];

      return messageLocalization.format(
        'dxChat-typingMessageSingleUser',
        // @ts-expect-error
        username,
      );
    }

    if (usernames?.length === 2) {
      const [usernameFirst, usernameSecond] = usernames;

      return messageLocalization.format(
        'dxChat-typingMessageTwoUsers',
        // @ts-expect-error
        usernameFirst,
        usernameSecond,
      );
    }

    if (usernames?.length === 3) {
      const [
        usernameFirst,
        usernameSecond,
        usernameThird,
      ] = usernames;

      return messageLocalization.format(
        'dxChat-typingMessageThreeUsers',
        // @ts-expect-error
        usernameFirst,
        usernameSecond,
        usernameThird,
      );
    }

    const usernameString = usernames.slice(0, 3).join(', ');

    return messageLocalization.format(
      'dxChat-typingMessageMultipleUsers',
      // @ts-expect-error
      usernameString,
    );
  }

  _updateText(): void {
    const value = this._getText();

    this._$text?.text(value);
  }

  _processTypingUsersUpdating(previousValue: User[]): void {
    const { typingUsers } = this.option();

    if (previousValue?.length && typingUsers?.length) {
      this._updateText();

      return;
    }

    if (typingUsers?.length) {
      this._renderContent();

      return;
    }

    this._cleanContent();
  }

  _cleanContent(): void {
    this.$element().empty();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, previousValue } = args;

    switch (name) {
      case 'typingUsers':
        this._processTypingUsersUpdating(previousValue ?? []);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default TypingIndicator;

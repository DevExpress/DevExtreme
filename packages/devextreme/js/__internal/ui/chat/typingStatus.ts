/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Properties as DOMComponentProperties } from '@js/core/dom_component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';

export interface Properties extends DOMComponentProperties {
  typingStatuses: any;
}

const CHAT_TYPING_STATUS_CLASS = 'dx-chat-typing-status';
const CHAT_TYPING_STATUS_TEXT_CLASS = 'dx-chat-typing-text-status';

class TypingStatus extends DOMComponent<TypingStatus, Properties> {
  private _$text!: dxElementWrapper;

  private _statuses!: any;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      typingStatuses: undefined,
    };
  }

  _init(): void {
    super._init();

    this._statuses = {};

    this._initStatuses();
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_TYPING_STATUS_CLASS);

    super._initMarkup();

    this._renderTextElement();

    this._updateStatuses();
  }

  _renderTextElement(): void {
    this._$text = $('<div>')
      .addClass(CHAT_TYPING_STATUS_TEXT_CLASS)
      .appendTo(this.element());
  }

  _initStatuses(): void {
    const { typingStatuses } = this.option();

    const userIds = Object.keys(typingStatuses);

    userIds.forEach((userId) => {
      const status = typingStatuses[userId];

      this._addTypingStatus(userId, status);
    });
  }

  _addTypingStatus(userId: any, status: any): void {
    const timeoutId = setTimeout(() => {
      this._removeTypingStatus(userId);
    }, 3000);

    this._statuses[userId] = {
      ...status,
      timeoutId,
    };
  }

  _removeTypingStatus(userId: any): void {
    if (this._statuses[userId]) {
      clearTimeout(this._statuses[userId].timeoutHandle);

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._statuses[userId];

      this._updateStatuses();
    }
  }

  _updateTypingStatus(userId: any, status: any): void {
    if (this._statuses[userId]) {
      clearTimeout(this._statuses[userId].timeoutHandle);
    }

    this._addTypingStatus(userId, status);
  }

  _getStatusText(users: any): string {
    if (!users?.length) {
      return '';
    }

    const usersString = users.join(', ');
    const text = `${usersString} are typing...`;

    return text;
  }

  _getUserNames(typingStatuses: any): any[] {
    const keys = Object.keys(typingStatuses);
    const userNames = keys.map((key): any => typingStatuses[key].user.name);

    return userNames;
  }

  _updateText(text: string): void {
    this._$text.text(text);
  }

  _updateStatuses(): void {
    const typingStatuses = this._statuses;
    const userNames = this._getUserNames(typingStatuses);
    const text = this._getStatusText(userNames);

    this._updateText(text);
  }

  _processStatusUpdating(newTypingStatuses: any, prevTypingStatuses: any): void {
    const userIds = Object.keys(newTypingStatuses);

    userIds.forEach((userId) => {
      const newStatus = newTypingStatuses[userId];
      const prevStatus = prevTypingStatuses[userId];

      if (!this._statuses[userId]) {
        this._addTypingStatus(userId, newStatus);
      } else if (prevStatus?.timestamp !== newStatus.timestamp) {
        this._updateTypingStatus(userId, newStatus);
      }
    });

    const internalUserIds = Object.keys(this._statuses);

    internalUserIds.forEach((userId) => {
      if (!newTypingStatuses[userId]) {
        this._removeTypingStatus(userId);
      }
    });

    this._updateStatuses();
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'typingStatuses':
        this._processStatusUpdating(value, previousValue);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default TypingStatus;

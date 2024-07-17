/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

export const renderHeader = (element, text): void => {
  const $headerText = $('<p>')
    .addClass(CHAT_HEADER_TEXT_CLASS)
    .text(text);

  $('<div>')
    .addClass(CHAT_HEADER_CLASS)
    .append($headerText)
    .appendTo(element);
};

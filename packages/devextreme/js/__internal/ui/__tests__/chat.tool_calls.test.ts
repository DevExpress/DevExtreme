import {
  afterEach, beforeAll, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import { loadMessages, locale } from '@js/common/core/localization';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import ArrayStore from '@js/data/array_store';
import CustomStore from '@js/data/custom_store';
import DataSource from '@js/data/data_source';
import type { Message, Properties, ToolCall } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import {
  CHAT_MESSAGEBUBBLE_CLASS,
  CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
  CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS,
} from '@ts/ui/chat/messagebubble';

import { ChatModel } from './__mock__/model/chat/chat';
import type { MessageBubbleModel } from './__mock__/model/chat/message_bubble';

const USER = { id: 'user', name: 'User' };
const ASSISTANT = { id: 'assistant', name: 'Assistant' };

const WEATHER: ToolCall = { name: 'getWeather', arguments: { city: 'London' }, result: '15°C' };
const TIME: ToolCall = { name: 'getCurrentTime', arguments: { city: 'Barcelona' }, result: '14:30' };
const FAILED: ToolCall = {
  name: 'getRate', arguments: { from: 'USD' }, result: 'Service is not available', status: 'error',
};

let nextId = 0;

const createMessage = (message: Partial<Message> & Record<string, unknown> = {}): Message => {
  nextId += 1;

  return {
    id: nextId, author: ASSISTANT, text: 'Answer', timestamp: new Date(), ...message,
  } as Message;
};

const chats: Chat[] = [];

const createChat = (options: Partial<Properties> = {}): ChatModel => {
  const $element = $('<div>').appendTo(document.body);

  const instance = new Chat($element.get(0) as HTMLElement, { user: USER, ...options });

  chats.push(instance);

  return new ChatModel($element.get(0) as HTMLElement);
};

type StoreChanges = Parameters<ArrayStore['push']>[0];

interface StoreChat {
  chat: ChatModel;
  push: (changes: StoreChanges) => void;
}

const createStoreChat = (
  messages: Message[] = [],
  options: Partial<Properties> = {},
): StoreChat => {
  const store = new ArrayStore({ key: 'id', data: [...messages] });
  const dataSource = new DataSource({ store, paginate: false, pushAggregationTimeout: 0 });
  const chat = createChat({ dataSource, reloadOnChange: false, ...options });

  jest.runAllTimers();

  return {
    chat,
    push: (changes): void => {
      store.push(changes);
      jest.runAllTimers();
    },
  };
};

const getBubble = (chat: ChatModel, index = 0): MessageBubbleModel => chat.getMessageBubble(index);

const getCallsExpandedStates = (bubble: MessageBubbleModel): boolean[] => bubble.getToolCalls()
  .map((call) => call.isExpanded());

describe('Chat tool calls', () => {
  beforeAll(() => {
    fx.off = true;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    chats.forEach((instance) => instance.dispose());
    chats.length = 0;
    document.body.innerHTML = '';
    locale('en');
    jest.useRealTimers();
  });

  describe('markup', () => {
    it('should not render the block for a message without toolCalls', () => {
      const chat = createChat({ items: [createMessage()] });
      const bubble = getBubble(chat);

      expect(bubble.hasToolCalls()).toBe(false);
      expect(bubble.getChildClassNames()).toEqual([CHAT_MESSAGEBUBBLE_CONTENT_CLASS]);
    });

    it('should not render the block for an empty toolCalls array', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [] })] });
      const bubble = getBubble(chat);

      expect(bubble.hasToolCalls()).toBe(false);
      expect(bubble.getChildClassNames()).toEqual([CHAT_MESSAGEBUBBLE_CONTENT_CLASS]);
    });

    it('should render one Accordion item and no title for one call', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });
      const bubble = getBubble(chat);
      const calls = bubble.getToolCalls();

      expect(bubble.hasToolCalls()).toBe(true);
      expect(bubble.getAccordionElement()).not.toBeNull();
      expect(calls).toHaveLength(1);
      expect(calls[0].getName()).toBe('getWeather');
      expect(calls[0].hasIcon()).toBe(true);
      expect(bubble.getToolCallsTitleText()).toBeNull();
    });

    it('should render the title "N tools" and one Accordion with an item per call for several calls', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, TIME, FAILED] })] });
      const bubble = getBubble(chat);

      expect(bubble.getToolCallsTitleText()).toBe('3 tools');
      expect(bubble.getToolCalls().map((call) => call.getName()))
        .toEqual(['getWeather', 'getCurrentTime', 'getRate']);
      expect(bubble.getAccordionsCount()).toBe(1);
    });

    it('should render the block before the text', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });
      const bubble = getBubble(chat);

      expect(bubble.getChildClassNames()).toEqual([
        CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS,
        CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
      ]);
      expect(bubble.isToolCallsBeforeContent()).toBe(true);
      expect(bubble.getText()).toBe('Answer');
    });

    it('should render the block, the text and the attachments in this order', () => {
      const chat = createChat({
        items: [createMessage({
          toolCalls: [WEATHER],
          attachments: [{ name: 'report.txt', size: 10 }],
        })],
      });
      const bubble = getBubble(chat);
      const classNames = bubble.getChildClassNames();

      expect(classNames).toHaveLength(3);
      expect(classNames.slice(0, 2)).toEqual([
        CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS,
        CHAT_MESSAGEBUBBLE_CONTENT_CLASS,
      ]);
    });

    it('should render only the block for a message without text', () => {
      const chat = createChat({
        items: [createMessage({ text: undefined, toolCalls: [WEATHER] })],
      });
      const bubble = getBubble(chat);

      expect(bubble.hasToolCalls()).toBe(true);
      expect(bubble.getText()).toBe('');
    });

    it('should not render the block for a deleted message', () => {
      const chat = createChat({
        items: [createMessage({ isDeleted: true, toolCalls: [WEATHER] })],
      });
      const bubble = getBubble(chat);

      expect(bubble.isDeleted()).toBe(true);
      expect(bubble.hasToolCalls()).toBe(false);
    });

    it('should ignore toolCalls of an image message', () => {
      const chat = createChat({
        items: [createMessage({
          type: 'image', src: 'image.png', alt: 'Image', text: undefined, toolCalls: [WEATHER],
        })],
      });
      const bubble = getBubble(chat);

      expect(bubble.isImage()).toBe(true);
      expect(bubble.hasToolCalls()).toBe(false);
    });

    it('should render a block in every message that has toolCalls', () => {
      const chat = createChat({
        items: [
          createMessage({ toolCalls: [WEATHER] }),
          createMessage(),
          createMessage({ toolCalls: [TIME, WEATHER] }),
        ],
      });

      expect(chat.getMessageBubbles().map((bubble) => bubble.hasToolCalls()))
        .toEqual([true, false, true]);
      expect(chat.getToolCallsElements()).toHaveLength(2);
    });

    it('should have no tab stop in the block', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, TIME] })] });
      const bubble = getBubble(chat);

      bubble.getToolCalls().forEach((call) => call.toggle());

      const tabStops = Array.from(
        bubble.getToolCallsElement()?.querySelectorAll('[tabindex]') ?? [],
      ).filter((element) => element.getAttribute('tabindex') !== '-1');

      expect(bubble.getAccordionElement()?.hasAttribute('tabindex')).toBe(false);
      expect(tabStops).toHaveLength(0);
    });
  });

  describe('call body', () => {
    it('should show the Arguments and the Result fields', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getFieldLabels()).toEqual(['Arguments', 'Result']);
      expect(call.getArgumentsText()).toBe('{\n  "city": "London"\n}');
      expect(call.getResultText()).toBe('15°C');
    });

    it('should show only the Result for a call without arguments', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ name: 'getTime', result: '14:30' }] })],
      });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getFieldLabels()).toEqual(['Result']);
      expect(call.getArgumentsText()).toBeNull();
      expect(call.getResultText()).toBe('14:30');
    });

    it('should show only the Result for a call with empty arguments', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ name: 'getTime', arguments: {}, result: '14:30' }] })],
      });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getFieldLabels()).toEqual(['Result']);
    });

    it('should show only the Arguments for a call without result', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ name: 'getWeather', arguments: { city: 'London' } }] })],
      });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getFieldLabels()).toEqual(['Arguments']);
      expect(call.getResultText()).toBeNull();
    });

    it('should show an object result as JSON', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ name: 'getRate', result: { rate: 0.92 } }] })],
      });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getResultText()).toBe('{\n  "rate": 0.92\n}');
    });

    it('should keep the line breaks of a string result', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ name: 'getTime', result: 'Barcelona: 14:30\nLondon: 13:30' }] })],
      });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getResultText()).toBe('Barcelona: 14:30\nLondon: 13:30');
    });

    it('should show the fields as read-only text (no HTML is created from the values)', () => {
      const html = {
        name: '<b>bold</b>',
        arguments: { value: '<img src="x" onerror="alert(1)">' },
        result: '<script>alert(1)</script>',
      };
      const chat = createChat({ items: [createMessage({ toolCalls: [html] })] });
      const bubble = getBubble(chat);
      const [call] = bubble.getToolCalls();

      call.toggle();

      const block = bubble.getToolCallsElement() as HTMLElement;

      expect(call.getName()).toBe('<b>bold</b>');
      expect(call.getArgumentsText()).toContain('<img src=');
      expect(call.getResultText()).toBe('<script>alert(1)</script>');
      expect(block.querySelector('b, img, script')).toBeNull();
    });
  });

  describe('status', () => {
    it('should show no error tag for a call with status "success"', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ ...WEATHER, status: 'success' }, TIME] })],
      });
      const bubble = getBubble(chat);

      expect(bubble.getToolCalls().map((call) => call.getErrorTagText())).toEqual([null, null]);
      expect(bubble.getToolCallsTitleErrorTagText()).toBeNull();
    });

    it('should treat a call without status as successful', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });
      const [call] = getBubble(chat).getToolCalls();

      call.toggle();

      expect(call.getErrorTagText()).toBeNull();
      expect(call.hasErrorResult()).toBe(false);
    });

    it('should show the "Error" tag and highlight the result of a failed call', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, FAILED] })] });
      const [success, failed] = getBubble(chat).getToolCalls();

      success.toggle();
      failed.toggle();

      expect(success.getErrorTagText()).toBeNull();
      expect(success.hasErrorResult()).toBe(false);
      expect(failed.getErrorTagText()).toBe('Error');
      expect(failed.hasErrorResult()).toBe(true);
      expect(failed.getResultText()).toBe('Service is not available');
    });

    it('should show the "Error" tag for a single failed call and no tag in the title', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [FAILED] })] });
      const bubble = getBubble(chat);

      expect(bubble.getToolCalls()[0].getErrorTagText()).toBe('Error');
      expect(bubble.getToolCallsTitleText()).toBeNull();
      expect(bubble.getToolCallsTitleErrorTagText()).toBeNull();
    });

    it('should show "1 Error" in the title for one failed call', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, FAILED] })] });

      expect(getBubble(chat).getToolCallsTitleErrorTagText()).toBe('1 Error');
    });

    it('should show "N Errors" in the title for several failed calls', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [FAILED, WEATHER, FAILED] })] });

      expect(getBubble(chat).getToolCallsTitleText()).toBe('3 tools');
      expect(getBubble(chat).getToolCallsTitleErrorTagText()).toBe('2 Errors');
    });
  });

  describe('expanded state', () => {
    it('should collapse all calls by default', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, TIME] })] });

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, false]);
    });

    it('should expand a call with expanded: true', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [WEATHER, { ...TIME, expanded: true }] })],
      });

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, true]);
    });

    it('should expand several calls at the same time', () => {
      const chat = createChat({
        items: [createMessage({
          toolCalls: [{ ...WEATHER, expanded: true }, TIME, { ...FAILED, expanded: true }],
        })],
      });

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false, true]);
    });

    it('should expand and collapse a call by a click on its title', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, TIME] })] });
      const [first, second] = getBubble(chat).getToolCalls();

      first.toggle();
      second.toggle();

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, true]);

      first.toggle();

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, true]);
    });

    it('should render a collapsed call without its body until it is opened', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });
      const [call] = getBubble(chat).getToolCalls();

      expect(call.hasBody()).toBe(false);

      call.toggle();

      expect(call.hasBody()).toBe(true);
    });
  });

  describe('toolCallOptions', () => {
    it('should have both options false by default', () => {
      const chat = createChat();

      expect(chat.getInstance().option('toolCallOptions')).toEqual({
        showInMessageTemplate: false,
        expandAll: false,
      });
    });

    it('should keep the other default when a partial object is passed', () => {
      const expandAll = createChat({ toolCallOptions: { expandAll: true } });
      const showInMessageTemplate = createChat({
        toolCallOptions: { showInMessageTemplate: true },
      });

      expect(expandAll.getInstance().option('toolCallOptions')).toEqual({
        showInMessageTemplate: false,
        expandAll: true,
      });
      expect(showInMessageTemplate.getInstance().option('toolCallOptions')).toEqual({
        showInMessageTemplate: true,
        expandAll: false,
      });
    });

    it('should change a single field at run time', () => {
      const chat = createChat({ toolCallOptions: { showInMessageTemplate: true } });

      chat.getInstance().option('toolCallOptions.expandAll', true);

      expect(chat.getInstance().option('toolCallOptions')).toEqual({
        showInMessageTemplate: true,
        expandAll: true,
      });
    });

    describe('expandAll', () => {
      it('should expand the calls that have no own expanded', () => {
        const chat = createChat({
          toolCallOptions: { expandAll: true },
          items: [createMessage({ toolCalls: [WEATHER, TIME] })],
        });

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, true]);
      });

      it('should keep a call collapsed when its own expanded is false and expandAll is true', () => {
        const chat = createChat({
          toolCallOptions: { expandAll: true },
          items: [createMessage({
            toolCalls: [WEATHER, { ...TIME, expanded: false }, FAILED],
          })],
        });

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false, true]);
      });

      it('should expand a call when its own expanded is true and expandAll is false', () => {
        const chat = createChat({
          toolCallOptions: { expandAll: false },
          items: [createMessage({ toolCalls: [WEATHER, { ...TIME, expanded: true }] })],
        });

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, true]);
      });

      it('should render the existing messages again when expandAll is changed at run time', () => {
        const chat = createChat({
          items: [
            createMessage({ toolCalls: [WEATHER, TIME] }),
            createMessage({ toolCalls: [WEATHER, { ...TIME, expanded: false }] }),
          ],
        });

        chat.getInstance().option('toolCallOptions.expandAll', true);

        expect(chat.getMessageBubbles().map(getCallsExpandedStates))
          .toEqual([[true, true], [true, false]]);

        chat.getInstance().option('toolCallOptions.expandAll', false);

        expect(chat.getMessageBubbles().map(getCallsExpandedStates))
          .toEqual([[false, false], [false, false]]);
      });

      it('should keep the own expanded when expandAll is changed at run time', () => {
        const chat = createChat({
          items: [createMessage({
            toolCalls: [{ ...WEATHER, expanded: true }, { ...TIME, expanded: false }, FAILED],
          })],
        });

        chat.getInstance().option('toolCallOptions', { expandAll: true });

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false, true]);

        chat.getInstance().option('toolCallOptions', { expandAll: false });

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false, false]);
      });

      it('should reset the state changed by the user when expandAll is changed', () => {
        const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER, TIME] })] });

        getBubble(chat).getToolCalls()[0].toggle();

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false]);

        chat.getInstance().option('toolCallOptions.expandAll', true);
        chat.getInstance().option('toolCallOptions.expandAll', false);

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, false]);
      });

      it('should apply expandAll to the messages that arrive later', () => {
        const { chat, push } = createStoreChat([], { toolCallOptions: { expandAll: true } });

        push([{ type: 'insert', data: createMessage({ toolCalls: [WEATHER, TIME] }) }]);

        expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, true]);
      });
    });
  });

  describe('messageTemplate', () => {
    const messageTemplate = ({ message }: { message: Message }, container: Element): void => {
      $('<span>').addClass('custom-text').text(`custom: ${(message as { text?: string }).text}`)
        .appendTo(container);
    };

    const getCustomText = (bubble: MessageBubbleModel): string | null => bubble.getContentElement()
      .querySelector('.custom-text')?.textContent ?? null;

    it('should not render the block when messageTemplate is set (showInMessageTemplate is false)', () => {
      const chat = createChat({
        messageTemplate,
        items: [createMessage({ toolCalls: [WEATHER] })],
      });
      const bubble = getBubble(chat);

      expect(bubble.hasToolCalls()).toBe(false);
      expect(getCustomText(bubble)).toBe('custom: Answer');
    });

    it('should pass toolCalls to the template', () => {
      const received: ToolCall[][] = [];
      const chat = createChat({
        messageTemplate: ({ message }: { message: Message }, container: Element) => {
          received.push((message as { toolCalls: ToolCall[] }).toolCalls);
          $('<span>').text('t').appendTo(container);
        },
        items: [createMessage({ toolCalls: [WEATHER, TIME] })],
      });

      expect(chat.getMessageBubbles()).toHaveLength(1);
      expect(received[0].map(({ name }) => name)).toEqual(['getWeather', 'getCurrentTime']);
    });

    it('should render the template again with the new toolCalls when only toolCalls are updated', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message], {
        messageTemplate: ({ message: data }: { message: Message }, container: Element) => {
          const names = ((data as { toolCalls?: ToolCall[] }).toolCalls ?? [])
            .map(({ name }) => name).join(',');

          $('<span>').addClass('custom-text').text(names).appendTo(container);
        },
      });

      expect(getCustomText(getBubble(chat))).toBe('getWeather');

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER, TIME] } }]);

      expect(getCustomText(getBubble(chat))).toBe('getWeather,getCurrentTime');
    });

    it('should render the block above the content of the template when showInMessageTemplate is true', () => {
      const chat = createChat({
        messageTemplate,
        toolCallOptions: { showInMessageTemplate: true },
        items: [createMessage({ toolCalls: [WEATHER, TIME] })],
      });
      const bubble = getBubble(chat);

      expect(bubble.hasToolCalls()).toBe(true);
      expect(bubble.getToolCalls()).toHaveLength(2);
      expect(bubble.isToolCallsBeforeContent()).toBe(true);
      expect(getCustomText(bubble)).toBe('custom: Answer');
    });

    it('should render the block without messageTemplate whatever showInMessageTemplate is', () => {
      const withFalse = createChat({
        toolCallOptions: { showInMessageTemplate: false },
        items: [createMessage({ toolCalls: [WEATHER] })],
      });
      const withTrue = createChat({
        toolCallOptions: { showInMessageTemplate: true },
        items: [createMessage({ toolCalls: [WEATHER] })],
      });

      expect(getBubble(withFalse).hasToolCalls()).toBe(true);
      expect(getBubble(withTrue).hasToolCalls()).toBe(true);
    });

    it('should show and hide the block when showInMessageTemplate is changed at run time', () => {
      const chat = createChat({
        messageTemplate,
        items: [createMessage({ toolCalls: [WEATHER] })],
      });

      expect(getBubble(chat).hasToolCalls()).toBe(false);

      chat.getInstance().option('toolCallOptions.showInMessageTemplate', true);

      expect(getBubble(chat).hasToolCalls()).toBe(true);
      expect(getCustomText(getBubble(chat))).toBe('custom: Answer');

      chat.getInstance().option('toolCallOptions.showInMessageTemplate', false);

      expect(getBubble(chat).hasToolCalls()).toBe(false);
      expect(getCustomText(getBubble(chat))).toBe('custom: Answer');
    });

    it('should hide and show the block when messageTemplate is set and removed at run time', () => {
      const chat = createChat({ items: [createMessage({ toolCalls: [WEATHER] })] });

      expect(getBubble(chat).hasToolCalls()).toBe(true);

      chat.getInstance().option('messageTemplate', messageTemplate);

      expect(getBubble(chat).hasToolCalls()).toBe(false);

      chat.getInstance().option('messageTemplate', null);

      expect(getBubble(chat).hasToolCalls()).toBe(true);
    });

    it('should apply the own expanded and expandAll to the block rendered with a template', () => {
      const chat = createChat({
        messageTemplate,
        toolCallOptions: { showInMessageTemplate: true, expandAll: true },
        items: [createMessage({ toolCalls: [WEATHER, { ...TIME, expanded: false }] })],
      });

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false]);
    });
  });

  describe('updates through the data source', () => {
    it('should render the block of a message that is inserted', () => {
      const { chat, push } = createStoreChat();

      push([{ type: 'insert', data: createMessage({ toolCalls: [WEATHER, TIME] }) }]);

      expect(getBubble(chat).hasToolCalls()).toBe(true);
      expect(getBubble(chat).getToolCallsTitleText()).toBe('2 tools');
    });

    it('should render the block again when toolCalls are updated', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);
      const blockBefore = getBubble(chat).getToolCallsElement();

      push([{ type: 'update', key: message.id, data: { toolCalls: [TIME, FAILED] } }]);

      const bubble = getBubble(chat);

      expect(bubble.getToolCallsElement()).not.toBe(blockBefore);
      expect(bubble.getToolCalls().map((call) => call.getName())).toEqual(['getCurrentTime', 'getRate']);
      expect(bubble.getToolCallsTitleErrorTagText()).toBe('1 Error');
    });

    it('should render the block again even when the same toolCalls are passed', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);
      const blockBefore = getBubble(chat).getToolCallsElement();

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER] } }]);

      expect(getBubble(chat).getToolCallsElement()).not.toBe(blockBefore);
    });

    it('should not keep the state opened by the user when toolCalls are updated', () => {
      const message = createMessage({ toolCalls: [WEATHER, TIME] });
      const { chat, push } = createStoreChat([message]);

      getBubble(chat).getToolCalls()[0].toggle();

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, false]);

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER, TIME] } }]);

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, false]);
    });

    it('should take the new own expanded when toolCalls are updated', () => {
      const message = createMessage({ toolCalls: [WEATHER, TIME] });
      const { chat, push } = createStoreChat([message]);

      push([{
        type: 'update', key: message.id, data: { toolCalls: [WEATHER, { ...TIME, expanded: true }] },
      }]);

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, true]);
    });

    it('should add the block to a message that had no toolCalls', () => {
      const message = createMessage();
      const { chat, push } = createStoreChat([message]);

      expect(getBubble(chat).hasToolCalls()).toBe(false);

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER] } }]);

      expect(getBubble(chat).hasToolCalls()).toBe(true);
      expect(getBubble(chat).getChildClassNames()[0]).toBe(CHAT_MESSAGEBUBBLE_TOOLCALLS_CLASS);
    });

    it('should remove the block when toolCalls are removed', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);

      push([{ type: 'update', key: message.id, data: { toolCalls: undefined } }]);

      expect(getBubble(chat).hasToolCalls()).toBe(false);
      expect(getBubble(chat).getChildClassNames()).toEqual([CHAT_MESSAGEBUBBLE_CONTENT_CLASS]);
    });

    it('should remove the block when toolCalls become an empty array', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);

      push([{ type: 'update', key: message.id, data: { toolCalls: [] } }]);

      expect(getBubble(chat).hasToolCalls()).toBe(false);
    });

    it('should remove the block when the message is deleted', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);

      push([{ type: 'update', key: message.id, data: { isDeleted: true } }]);

      expect(getBubble(chat).isDeleted()).toBe(true);
      expect(getBubble(chat).hasToolCalls()).toBe(false);
    });

    it('should keep the block when the text of the message is edited', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);
      const blockBefore = getBubble(chat).getToolCallsElement();

      push([{ type: 'update', key: message.id, data: { text: 'Edited', isEdited: true } }]);

      expect(getBubble(chat).getText()).toBe('Edited');
      expect(getBubble(chat).getToolCallsElement()).toBe(blockBefore);
    });

    it('should not render the block when toolCalls are added to an image message', () => {
      const message = createMessage({
        type: 'image', src: 'image.png', alt: 'Image', text: undefined,
      });
      const { chat, push } = createStoreChat([message]);

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER] } }]);

      expect(getBubble(chat).isImage()).toBe(true);
      expect(getBubble(chat).hasToolCalls()).toBe(false);
    });

    it('should remove the block when a text message is changed to an image message', () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createStoreChat([message]);

      push([{
        type: 'update', key: message.id, data: { type: 'image', src: 'image.png', alt: 'Image' },
      }]);

      expect(getBubble(chat).isImage()).toBe(true);
      expect(getBubble(chat).hasToolCalls()).toBe(false);
    });

    it('should apply expandAll when an image message is changed to a text message with toolCalls', () => {
      const message = createMessage({
        type: 'image', src: 'image.png', alt: 'Image', text: undefined,
      });
      const { chat, push } = createStoreChat([message], {
        toolCallOptions: { expandAll: true },
      });

      push([{
        type: 'update',
        key: message.id,
        data: { type: 'text', text: 'Answer', toolCalls: [WEATHER, TIME] },
      }]);

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([true, true]);
    });

    it('should render the block when an image message is changed to a text message with toolCalls', () => {
      const message = createMessage({
        type: 'image', src: 'image.png', alt: 'Image', text: undefined,
      });
      const { chat, push } = createStoreChat([message]);

      push([{
        type: 'update',
        key: message.id,
        data: { type: 'text', text: 'Answer', toolCalls: [WEATHER] },
      }]);

      expect(getBubble(chat).isImage()).toBe(false);
      expect(getBubble(chat).hasToolCalls()).toBe(true);
    });

    it('should not render the block when toolCalls are added to a message with messageTemplate', () => {
      const message = createMessage();
      const { chat, push } = createStoreChat([message], {
        messageTemplate: (_: unknown, container: Element) => {
          $('<span>').text('t').appendTo(container);
        },
      });

      push([{ type: 'update', key: message.id, data: { toolCalls: [WEATHER] } }]);

      expect(getBubble(chat).hasToolCalls()).toBe(false);
    });
  });

  describe('streaming', () => {
    const streamText = (
      push: StoreChat['push'],
      message: Message,
      chunks: string[],
    ): void => {
      let text = '';

      chunks.forEach((chunk) => {
        text += chunk;
        push([{ type: 'update', key: message.id, data: { text } }]);
      });
    };

    it('should not render the block again when only the text is updated', () => {
      const message = createMessage({ text: '', toolCalls: [WEATHER, TIME] });
      const { chat, push } = createStoreChat([message]);
      const blockBefore = getBubble(chat).getToolCallsElement();
      const accordionBefore = getBubble(chat).getAccordionElement();

      streamText(push, message, ['Hel', 'lo ', 'wor', 'ld']);

      expect(getBubble(chat).getText()).toBe('Hello world');
      expect(getBubble(chat).getToolCallsElement()).toBe(blockBefore);
      expect(getBubble(chat).getAccordionElement()).toBe(accordionBefore);
    });

    it('should keep the item opened by the user while the text is streamed', () => {
      const message = createMessage({ text: '', toolCalls: [WEATHER, TIME] });
      const { chat, push } = createStoreChat([message]);

      getBubble(chat).getToolCalls()[1].toggle();
      streamText(push, message, ['A', 'B', 'C']);

      expect(getCallsExpandedStates(getBubble(chat))).toEqual([false, true]);
      expect(getBubble(chat).getText()).toBe('ABC');
    });

    it('should keep the block of a message with messageTemplate and showInMessageTemplate: true', () => {
      const message = createMessage({ text: '', toolCalls: [WEATHER, TIME] });
      const { chat, push } = createStoreChat([message], {
        toolCallOptions: { showInMessageTemplate: true },
        messageTemplate: ({ message: data }: { message: Message }, container: Element) => {
          $('<span>').addClass('custom-text').text((data as { text?: string }).text ?? '')
            .appendTo(container);
        },
      });
      const blockBefore = getBubble(chat).getToolCallsElement();
      const accordionBefore = getBubble(chat).getAccordionElement();

      getBubble(chat).getToolCalls()[0].toggle();
      streamText(push, message, ['one ', 'two ', 'three']);

      const bubble = getBubble(chat);

      expect(bubble.getContentElement().querySelector('.custom-text')?.textContent)
        .toBe('one two three');
      expect(bubble.getToolCallsElement()).toBe(blockBefore);
      expect(bubble.getAccordionElement()).toBe(accordionBefore);
      expect(getCallsExpandedStates(bubble)).toEqual([true, false]);
    });

    it('should show the block that arrives first and then the streamed text', () => {
      const { chat, push } = createStoreChat();
      const message = createMessage({ text: '', toolCalls: [WEATHER] });

      push([{ type: 'insert', data: message }]);

      const block = getBubble(chat).getToolCallsElement();

      streamText(push, message, ['Done']);

      expect(getBubble(chat).getToolCallsElement()).toBe(block);
      expect(getBubble(chat).getText()).toBe('Done');
    });
  });

  describe('remote data source', () => {
    const LOAD_DELAY = 100;

    const resolveLater = <T>(result: T): DeferredObj<T> => {
      const deferred = Deferred<T>();

      // eslint-disable-next-line no-restricted-globals
      setTimeout(() => {
        deferred.resolve(result);
      }, LOAD_DELAY);

      return deferred;
    };

    const createRemoteChat = (messages: Message[]): { chat: ChatModel; push: StoreChat['push'] } => {
      const data = [...messages];
      const store = new CustomStore({
        key: 'id',
        load: (): PromiseLike<Message[]> => resolveLater([...data]).promise(),
      });
      const dataSource = new DataSource({ store, paginate: false, pushAggregationTimeout: 0 });
      const chat = createChat({ dataSource, reloadOnChange: false });

      return {
        chat,
        push: (changes): void => {
          store.push(changes);
          jest.runAllTimers();
        },
      };
    };

    it('should render the blocks of the messages that are loaded from a remote store', async () => {
      const { chat } = createRemoteChat([
        createMessage({ toolCalls: [WEATHER, FAILED] }),
        createMessage(),
      ]);

      expect(chat.getMessageBubbles()).toHaveLength(0);

      await jest.advanceTimersByTimeAsync(LOAD_DELAY);

      expect(chat.getMessageBubbles().map((bubble) => bubble.hasToolCalls()))
        .toEqual([true, false]);
      expect(getBubble(chat).getToolCallsTitleText()).toBe('2 tools');
      expect(getBubble(chat).getToolCallsTitleErrorTagText()).toBe('1 Error');
    });

    it('should update the block of a loaded message', async () => {
      const message = createMessage({ toolCalls: [WEATHER] });
      const { chat, push } = createRemoteChat([message]);

      await jest.advanceTimersByTimeAsync(LOAD_DELAY);

      push([{ type: 'update', key: message.id, data: { toolCalls: [TIME, WEATHER] } }]);

      expect(getBubble(chat).getToolCalls().map((call) => call.getName()))
        .toEqual(['getCurrentTime', 'getWeather']);
    });

    it('should render the block of a message that is pushed after the load', async () => {
      const { chat, push } = createRemoteChat([createMessage()]);

      await jest.advanceTimersByTimeAsync(LOAD_DELAY);

      push([{ type: 'insert', data: createMessage({ toolCalls: [WEATHER] }) }]);

      expect(chat.getMessageBubbles().map((bubble) => bubble.hasToolCalls()))
        .toEqual([false, true]);
    });
  });

  describe('renderMessage', () => {
    it('should render the block of a message added with renderMessage', () => {
      const chat = createChat();

      chat.getInstance().renderMessage(createMessage({ toolCalls: [WEATHER, TIME] }));

      expect(getBubble(chat).hasToolCalls()).toBe(true);
      expect(getBubble(chat).getToolCallsTitleText()).toBe('2 tools');
    });
  });

  describe('localization', () => {
    it('should use the overridden texts', () => {
      loadMessages({
        xx: {
          'dxChat-toolCallsTitle': 'Tools used: {0}',
          'dxChat-toolCallArgumentsLabel': 'Input',
          'dxChat-toolCallResultLabel': 'Output',
          'dxChat-toolCallError': 'Failed',
          'dxChat-toolCallsErrorSingle': '{0} failure',
          'dxChat-toolCallsErrorMultiple': '{0} failures',
        },
      });
      locale('xx');

      const chat = createChat({
        items: [
          createMessage({ toolCalls: [WEATHER, FAILED] }),
          createMessage({ toolCalls: [FAILED, FAILED] }),
        ],
      });
      const [first, second] = chat.getMessageBubbles();
      const [success, failed] = first.getToolCalls();

      success.toggle();

      expect(first.getToolCallsTitleText()).toBe('Tools used: 2');
      expect(first.getToolCallsTitleErrorTagText()).toBe('1 failure');
      expect(second.getToolCallsTitleErrorTagText()).toBe('2 failures');
      expect(failed.getErrorTagText()).toBe('Failed');
      expect(success.getFieldLabels()).toEqual(['Input', 'Output']);
    });
  });

  describe('focus', () => {
    it('should target the message input and not a field of an expanded tool call', () => {
      const chat = createChat({
        items: [createMessage({ toolCalls: [{ ...WEATHER, expanded: true }] })],
      });

      expect(getBubble(chat).getToolCalls()[0].getArgumentsText()).not.toBeNull();

      const target = (chat.getInstance() as unknown as {
        _focusTarget: () => { get: (index: number) => HTMLElement };
      })._focusTarget().get(0);

      expect(chat.getElement().contains(target)).toBe(true);
      expect(target.closest(`.${CHAT_MESSAGEBUBBLE_CLASS}`)).toBeNull();
    });
  });
});

/**
 * @jest-environment jsdom
 */

import { act } from 'preact/test-utils';
import $ from '../../../core/renderer';
import './utils/test_components/empty_test_widget';
import './utils/test_components/preact_test_widget';
import './utils/test_components/templated_test_widget';
import {
  defaultEvent,
  emitKeyboard,
  KEY,
} from '../../test_utils/events_mock';
import { setPublicElementWrapper } from '../../../core/element';

beforeEach(() => {
  document.body.innerHTML = `
    <div id="components">
        <div id="component"></div>
    </div>
    `;
});

afterEach(() => {
  $('#components').empty();
  document.body.innerHTML = '';
});

describe('Misc cases', () => {
  it('empty component creation does not fail', () => {
    expect(() => act(() => $('#component').dxEmptyTestWidget({}))).not.toThrowError();
  });

  it('on disposing should clean preact effects', () => {
    const subscribeEffect = jest.fn();
    const unsubscribeEffect = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      subscribeEffect,
      unsubscribeEffect,
    }));

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(0);

    act(() => $('#components').empty());

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(1);
  });

  it('should forward API calls to preact component', () => {
    act(() => $('#component').dxPreactTestWidget({ text: 'check api' }));
    const apiCallResult = $('#component').dxPreactTestWidget('apiMethodCheck', '1', '2');

    expect(apiCallResult).toBe('check api - 1 - 2');
  });

  it('setAria throws Error', () => {
    act(() => $('#component').dxPreactTestWidget({}));

    expect(() => {
      $('#component').dxPreactTestWidget('setAria');
    }).toThrowError('"setAria" method is deprecated, use "aria" property instead');
  });
});

describe('Widget\'s container manipulations', () => {
  it('repaint redraws preact component 2 times', () => {
    $('#component').css({ width: '123px', height: '456px' });
    $('#component').addClass('custom-css-class');

    const subscribeEffect = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      subscribeEffect,
    }));

    act(() => $('#component').dxPreactTestWidget('repaint'));

    expect(subscribeEffect).toHaveBeenCalledTimes(3);

    expect(subscribeEffect.mock.calls[1][0]).toMatchObject({
      className: '',
      style: '',
    });

    expect(subscribeEffect.mock.calls[2][0]).toMatchObject({
      className: 'custom-css-class',
      style: { width: '123px', height: '456px' },
    });
  });

  it('preact component\'s root replaces widget\'s container', () => {
    act(() => $('#component').dxPreactTestWidget({ }));

    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('preact component\'s root is widget\'s container after repaint', () => {
    act(() => $('#component').dxPreactTestWidget({ }));
    act(() => $('#component').dxPreactTestWidget('repaint'));

    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('preact component\'s root is widget\'s container after render in detached container and repaint', () => {
    const $container = $('#component');
    const parent = $container.parent();
    $container.remove();
    act(() => $container.dxPreactTestWidget({ text: 'test' }));

    act(() => {
      $container.appendTo(parent);
      $container.dxPreactTestWidget('repaint');
    });

    expect($('.dx-test-widget')[0]).not.toBe(undefined);
    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('pass custom class and attributes (with id) as props on first render', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    $('#my-id').addClass('dx-custom-css-class');
    $('#my-id').attr('data-custom-attr', 'attr-value');

    act(() => $('#my-id').dxPreactTestWidget({}));

    expect($('#my-id').dxPreactTestWidget('getLastProps')).toMatchObject({
      id: 'my-id',
      className: 'custom-css-class dx-custom-css-class',
      'data-custom-attr': 'attr-value',
    });
  });

  it('keep passing custom class and attributes (with id) props on repaint', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    $('#my-id').addClass('dx-custom-css-class');
    $('#my-id').attr('data-custom-attr', 'attr-value');
    act(() => $('#my-id').dxPreactTestWidget({}));

    act(() => $('#my-id').dxPreactTestWidget('repaint'));

    expect($('#my-id').dxPreactTestWidget('getLastProps')).toMatchObject({
      id: 'my-id',
      className: 'custom-css-class dx-custom-css-class',
      'data-custom-attr': 'attr-value',
    });
  });

  it('pass updated custom class on repaint', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    $('#my-id').addClass('dx-custom-css-class');
    act(() => $('#my-id').dxPreactTestWidget({}));

    $('#my-id').addClass('custom-css-class2');

    act(() => $('#my-id').dxPreactTestWidget('repaint'));

    expect($('#my-id').dxPreactTestWidget('getLastProps').className).toBe('custom-css-class custom-css-class2 dx-custom-css-class');
  });

  it('should save only initial "dx-" custom classes', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    act(() => $('#my-id').dxPreactTestWidget({}));

    $('#my-id').addClass('dx-custom-css-class');

    act(() => $('#my-id').dxPreactTestWidget('repaint'));

    expect($('#my-id').dxPreactTestWidget('getLastProps').className).toBe('custom-css-class');
  });

  it('widget does not show className option', () => {
    $('#component').addClass('custom-css-class');

    act(() => $('#component').dxPreactTestWidget({}));

    expect($('#component').dxPreactTestWidget('option')).not.toHaveProperty('className');
  });

  it('replace id on container with id from elementAttr option', () => {
    $('#component').attr('id', 'my-id');

    act(() => $('#my-id').dxPreactTestWidget({ elementAttr: { id: 'attr-id' } }));

    expect($('#attr-id').dxPreactTestWidget('getLastProps').id).toBe('attr-id');
  });

  it('merge unique css classes from elementAttr option with container class', () => {
    $('#component').addClass('custom-css-class attr-class');

    act(() => $('#component').dxPreactTestWidget({ elementAttr: { class: 'attr-css-class attr-class' } }));

    expect($('#component').dxPreactTestWidget('getLastProps').class).toBe('custom-css-class attr-class attr-css-class');
  });

  it('keep elementAttr option untouched', () => {
    $('component').addClass('custom-css-class attr-class');
    $('#component').attr('data-custom-attr', 'attr-value');

    act(() => $('#component').dxPreactTestWidget({ elementAttr: { id: 'attr-id', class: 'attr-css-class attr-class' } }));

    expect($('#attr-id').dxPreactTestWidget('option').elementAttr).toEqual({ id: 'attr-id', class: 'attr-css-class attr-class' });
  });

  it('pass style as key_value pair to props', () => {
    $('#component').css({ width: '123.5px', height: '456.6px' });

    act(() => $('#component').dxPreactTestWidget({}));

    expect($('#component').dxPreactTestWidget('getLastProps').style).toEqual({
      width: '123.5px',
      height: '456.6px',
    });
  });

  it('pass updated style on repaint', () => {
    $('#component').css({ width: '123.5px', height: '456.6px' });

    act(() => $('#component').dxPreactTestWidget({}));

    $('#component').css({ width: '23.5px', height: '56.6px', display: 'inline' });

    act(() => $('#component').dxPreactTestWidget('repaint'));

    expect($('#component').dxPreactTestWidget('getLastProps').style).toEqual({
      width: '23.5px',
      height: '56.6px',
      display: 'inline',
    });
  });
});

describe('option', () => {
  it('should return default props of preact component', () => {
    act(() => $('#component').dxPreactTestWidget({}));

    expect($('#component').dxPreactTestWidget('option').text).toBe('default text');
  });

  it('should copy default props of preact component (not by reference)', () => {
    document.body.innerHTML = `
      <div id="components">
          <div id="component1"></div>
          <div id="component2"></div>
      </div>
      `;

    act(() => {
      $('#component1').dxPreactTestWidget({});
      $('#component2').dxPreactTestWidget({});
    });

    const objectProp1 = $('#component1').dxPreactTestWidget('option').objectProp;
    const objectProp2 = $('#component2').dxPreactTestWidget('option').objectProp;

    expect(objectProp1).not.toBe(objectProp2);
  });

  it('should return default value of TwoWay prop', () => {
    act(() => $('#component').dxPreactTestWidget({}));

    expect($('#component').dxPreactTestWidget('option').twoWayProp).toBe(1);
  });

  it('should return updated value of TwoWay prop', () => {
    act(() => $('#component').dxPreactTestWidget({}));

    $('#component').dxPreactTestWidget('updateTwoWayPropCheck');

    expect($('#component').dxPreactTestWidget('option').twoWayProp).toBe(2);
  });

  it('fires optionChanged on TwoWay prop change', () => {
    const optionChanged = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onOptionChanged: optionChanged,
    }));

    $('#component').dxPreactTestWidget('updateTwoWayPropCheck');

    expect(optionChanged).toBeCalledTimes(1);
    expect(optionChanged.mock.calls[0][0]).toEqual({
      fullName: 'twoWayProp',
      name: 'twoWayProp',
      previousValue: 1,
      value: 2,
      element: $('#component').get(0),
      component: $('#component').dxPreactTestWidget('instance'),
    });
  });

  it('convert `undefined` to `null` for TwoWay props', () => {
    act(() => $('#component').dxPreactTestWidget({
      twoWayProp: 15,
    }));

    act(() => $('#component').dxPreactTestWidget({
      twoWayProp: undefined,
    }));

    expect($('#component').dxPreactTestWidget('getLastProps').twoWayProp).toBe(null);
    expect($('#component').dxPreactTestWidget('option').twoWayProp).toBe(undefined);
  });
});

describe('templates and slots', () => {
  it('pass anonymous template content as children', () => {
    $('#component').html('<span>Default slot</span>');

    act(() => $('#component').dxTemplatedTestWidget({}));

    expect($('#component').children().length).toBe(1);
    expect($('#component')[0].innerHTML).toBe('<span>Default slot</span>');
  });

  it('preserve anonymous template content element', () => {
    const element = $('<span>').html('Default slot');
    $('#component').append(element);

    act(() => $('#component').dxTemplatedTestWidget({}));

    expect($('#component').children()[0]).toBe(element[0]);
  });

  it('pass updated anonymous content on repaint', () => {
    const slotContent = $('<span>').html('Default slot');
    $('#component').append(slotContent);

    act(() => $('#component').dxTemplatedTestWidget({}));
    slotContent.html('Update slot');

    act(() => $('#component').dxTemplatedTestWidget('repaint'));

    expect($('#component')[0].innerHTML).toBe('<span>Update slot</span>');
  });

  describe('template function parameters', () => {
    it('template without index', () => {
      const template = jest.fn();

      act(() => $('#component').dxTemplatedTestWidget({
        template,
      }));

      const templateRoot = $('#component').children('.templates-root')[0];

      expect(template).toBeCalledTimes(1);
      expect(template.mock.calls[0]).toEqual([{ simpleTemplate: 'data' }, templateRoot]);
    });

    it('template with index', () => {
      const template = jest.fn();

      act(() => $('#component').dxTemplatedTestWidget({
        indexedTemplate: template,
      }));

      const templateRoot = $('#component').children('.templates-root')[0];

      expect(template).toBeCalledTimes(1);
      expect(template.mock.calls[0]).toEqual([{ indexedTemplate: 'data' }, 2, templateRoot]);
    });
  });

  it('insert template content to templates root', () => {
    act(() => $('#component').dxTemplatedTestWidget({
      template(data, element) {
        $(element).html('<span>Template content</span>');
      },
    }));

    const templateRoot = $('#component').children('.templates-root')[0];

    expect(templateRoot.innerHTML).toBe('<span>Template content</span>');
  });

  it('remove old template content between renders', () => {
    act(() => $('#component').dxTemplatedTestWidget({
      template(data, element) {
        $(element).append(`<span>Template - ${data.simpleTemplate}</span>`);
      },
    }));
    const templateRoot = $('#component').children('.templates-root')[0];

    act(() => $('#component').dxTemplatedTestWidget({
      text: 'new data',
    }));

    expect(templateRoot.innerHTML).toBe('<span>Template - new data</span>');
  });

  it('replace root with template if it returns .dx-template-wrapper node', () => {
    act(() => $('#component').dxTemplatedTestWidget({
      template() {
        return '<div class="dx-template-wrapper">Template content</div>';
      },
    }));

    expect($('#component').children('.dx-template-wrapper')[0])
      .toBe($('#component').children('.templates-root')[0]);
  });
});

describe('events/actions', () => {
  it('wraps event props with Actions with declared actionConfig', () => {
    const onEventProp = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onEventProp,
      beforeActionExecute: (_, action, actionConfig) => action(actionConfig),
    }));

    $('#component').dxPreactTestWidget('eventPropCheck', 'payload');

    expect($('#component').dxPreactTestWidget('option').onEventProp).toBe(onEventProp);
    expect(onEventProp.mock.calls[0][0].someConfigs).toBe('action-config');
    expect(onEventProp.mock.calls[1][0]).toEqual({
      actionValue: 'payload',
      component: $('#component').dxPreactTestWidget('instance'),
      element: $('#component').get(0),
    });
  });

  it('wraps DOM nodes in "*Element" args with jQuery and gets public element', () => {
    const getPublicElement = jest.fn(($el) => $el.get(0));
    setPublicElementWrapper(getPublicElement);

    const onEventProp = jest.fn();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    act(() => $('#component').dxPreactTestWidget({
      onEventProp,
    }));

    $('#component').dxPreactTestWidget('eventPropCheck', {
      eventElement: element1,
      nonWrappedNode: element2,
    });

    expect(onEventProp.mock.calls[0][0]).toMatchObject({
      eventElement: element1,
      nonWrappedNode: element2,
      element: $('#component').get(0),
    });

    expect(getPublicElement).toBeCalledTimes(2);
    expect(getPublicElement).toHaveBeenNthCalledWith(1, $(element1));
    expect(getPublicElement).toHaveBeenNthCalledWith(2, $('#component'));
  });

  it('re-wraps event props if it is changed', () => {
    const onEventProp1 = jest.fn();
    const onEventProp2 = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onEventProp: onEventProp1,
    }));

    act(() => $('#component').dxPreactTestWidget({
      onEventProp: onEventProp2,
    }));

    $('#component').dxPreactTestWidget('eventPropCheck', 'payload');

    expect($('#component').dxPreactTestWidget('option').onEventProp).toBe(onEventProp2);
    expect(onEventProp1).toBeCalledTimes(0);
    expect(onEventProp2).toBeCalledTimes(1);
    expect(onEventProp2.mock.calls[0][0]).toEqual({
      actionValue: 'payload',
      component: $('#component').dxPreactTestWidget('instance'),
      element: $('#component').get(0),
    });
  });
});

describe('registerKeyHandler', () => {
  it('call custom handler only', () => {
    const customHandler = jest.fn();
    const propHandler = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onKeyDown: propHandler,
    }));
    const instance = $('#component').dxPreactTestWidget('instance');

    instance.registerKeyHandler('space', customHandler);

    emitKeyboard(KEY.space);

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(customHandler).toHaveBeenCalledWith(defaultEvent,
      { originalEvent: defaultEvent, keyName: KEY.space, which: KEY.space });

    expect(propHandler).toHaveBeenCalledTimes(0);
  });

  it('call both handlers if custom handler returns something', () => {
    const customHandler = jest.fn(() => true);
    const propHandler = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onKeyDown: propHandler,
    }));
    const instance = $('#component').dxPreactTestWidget('instance');

    instance.registerKeyHandler('space', customHandler);

    emitKeyboard(KEY.space);

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(customHandler).toHaveBeenCalledWith(defaultEvent,
      { originalEvent: defaultEvent, keyName: KEY.space, which: KEY.space });

    expect(propHandler).toHaveBeenCalledTimes(1);
    expect(propHandler).toHaveBeenCalledWith(defaultEvent,
      { originalEvent: defaultEvent, keyName: KEY.space, which: KEY.space });
  });

  it('do not call custom handler on another keyDown event', () => {
    const customHandler = jest.fn();
    const propHandler = jest.fn();
    act(() => $('#component').dxPreactTestWidget({
      onKeyDown: propHandler,
    }));
    const instance = $('#component').dxPreactTestWidget('instance');

    instance.registerKeyHandler('space', customHandler);

    emitKeyboard(KEY.enter);

    expect(customHandler).toHaveBeenCalledTimes(0);

    expect(propHandler).toHaveBeenCalledTimes(1);
    expect(propHandler).toHaveBeenCalledWith(defaultEvent,
      { originalEvent: defaultEvent, keyName: KEY.enter, which: KEY.enter });
  });
});

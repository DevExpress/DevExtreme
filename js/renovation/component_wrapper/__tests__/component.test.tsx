/**
 * @jest-environment jsdom
 */
// eslint-disable-next-line import/named
import renderer, { dxElementWrapper } from '../../../core/renderer';
import './utils/test_components/empty_test_widget';
import './utils/test_components/test_widget';
import './utils/test_components/options_check_widget';
import './utils/test_components/templated_test_widget';
import {
  defaultEvent,
  emitKeyboard,
  KEY,
} from '../../test_utils/events_mock';
import { setPublicElementWrapper } from '../../../core/element';

const $ = renderer as (el: string | Element | dxElementWrapper) => dxElementWrapper & {
  dxEmptyTestWidget: any;
  dxTestWidget: any;
  dxOptionsCheckWidget: any;
  dxTemplatedTestWidget: any;
};

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
    expect(() => $('#component').dxEmptyTestWidget({})).not.toThrowError();
  });

  it('on disposing should clean effects', () => {
    const subscribeEffect = jest.fn();
    const unsubscribeEffect = jest.fn();
    $('#component').dxTestWidget({
      subscribeEffect,
      unsubscribeEffect,
    });

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(0);

    $('#components').empty();

    expect(subscribeEffect).toHaveBeenCalledTimes(1);
    expect(unsubscribeEffect).toHaveBeenCalledTimes(1);
  });

  it('should forward API calls to component', () => {
    $('#component').dxTestWidget({ text: 'check api' });
    const apiCallResult = $('#component').dxTestWidget('apiMethodCheck', '1', '2');

    expect(apiCallResult).toBe('check api - 1 - 2');
  });

  it('setAria throws Error', () => {
    $('#component').dxTestWidget({});

    expect(() => {
      $('#component').dxTestWidget('setAria');
    }).toThrowError('"setAria" method is deprecated, use "aria" property instead');
  });

  describe('API with Element type params/return type', () => {
    it('pass DOM node to if provided parameter is jQuery wrapper', () => {
      const element = document.createElement('div');
      const wrapper = $(element);

      $('#component').dxTestWidget({});

      const checkParam = $('#component').dxTestWidget('methodWithElementParam', wrapper);

      expect(checkParam.arg).toEqual(element);
    });

    it('leave param as is if it is not jQuery wrapper', () => {
      $('#component').dxTestWidget({});

      const checkParam = $('#component').dxTestWidget('methodWithElementParam', 15);

      expect(checkParam.arg).toEqual(15);
    });

    it('wraps return value with jQuery and gets public element', () => {
      const getPublicElement = jest.fn(($el) => $el.get(0));
      setPublicElementWrapper(getPublicElement);

      const element = document.createElement('div');

      $('#component').dxTestWidget({});

      const checkParam = $('#component').dxTestWidget('methodReturnElement', element);

      expect(checkParam).toEqual(element);

      expect(getPublicElement).toBeCalledTimes(1);
      expect(getPublicElement).toHaveBeenNthCalledWith(1, $(element));
    });
  });
});

describe('Widget\'s container manipulations', () => {
  describe('classes', () => {
    it('should add widget class', () => {
      $('#component').dxTestWidget({});

      expect($('#component')[0].className).toBe('dx-test-widget');
    });

    it('should save container initial classes', () => {
      $('#component').addClass('test-class');
      $('#component').addClass('dx-test-class');
      $('#component').dxTestWidget({});

      expect($('#component')[0].className).toBe('dx-test-widget test-class dx-test-class');

      $('#component').dxTestWidget('repaint');
      expect($('#component')[0].className).toBe('dx-test-widget test-class dx-test-class');
    });

    it('should save classes, added in runtime', () => {
      $('#component').dxTestWidget({});
      $('#component').addClass('test-class');
      $('#component').addClass('dx-test-class');

      expect($('#component')[0].className).toBe('dx-test-widget test-class dx-test-class');

      $('#component').dxTestWidget('instance').option('text', 'updated');
      expect($('#component')[0].className).toBe('dx-test-widget test-class dx-test-class');
    });

    it('should allow to remove initial classes', () => {
      $('#component').addClass('test-class');
      $('#component').addClass('dx-test-class');
      $('#component').dxTestWidget({});

      $('#component').removeClass('dx-test-class');

      $('#component').dxTestWidget('repaint');
      expect($('#component')[0].className).toBe('dx-test-widget test-class dx-test-class');
    });

    it('should allow to remove added classes', () => {
      $('#component').dxTestWidget({});
      $('#component').addClass('test-class');
      $('#component').addClass('dx-test-class');

      $('#component').removeClass('dx-test-class');

      $('#component').dxTestWidget('instance').option('text', 'updated');
      expect($('#component')[0].className).toBe('dx-test-widget test-class');
    });

    it('should allow to switch widget classes', () => {
      $('#component').dxTestWidget({});
      $('#component').addClass('test-class');
      $('#component').addClass('dx-test-class');

      $('#component').removeClass('dx-test-widget');
      $('#component').dxTestWidget('instance').option('text', 'updated_1');
      expect($('#component')[0].className).toBe('test-class dx-test-class');

      $('#component').addClass('dx-test-widget');
      $('#component').dxTestWidget('instance').option('text', 'updated_2');
      expect($('#component')[0].className).toBe('test-class dx-test-class dx-test-widget');
    });
  });

  it('repaint redraws component only one time', () => {
    $('#component').css('width', '123px');
    $('#component').css('height', '456px');
    $('#component').addClass('custom-css-class');

    const subscribeEffect = jest.fn();
    $('#component').dxTestWidget({
      subscribeEffect,
    });

    $('#component').dxTestWidget('repaint');

    expect(subscribeEffect).toHaveBeenCalledTimes(2);

    expect(subscribeEffect.mock.calls[1][0]).toMatchObject({
      className: 'custom-css-class',
      style: { width: '123px', height: '456px' },
    });
  });

  it('component\'s root replaces widget\'s container', () => {
    $('#component').dxTestWidget({});

    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('component\'s root is widget\'s container after repaint', () => {
    $('#component').dxTestWidget({});
    $('#component').dxTestWidget('repaint');

    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('component\'s root is widget\'s container after render in detached container', () => {
    const $container = $('#component');
    const parent = $container.parent('');
    $container.remove($container);
    $container.dxTestWidget({ text: 'test' });

    $container.appendTo(parent);

    expect($('.dx-test-widget')[0]).not.toBe(undefined);
    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('component\'s root is widget\'s container after render in detached container and repaint', () => {
    const $container = $('#component');
    const parent = $container.parent('');
    $container.remove($container);
    $container.dxTestWidget({ text: 'test' });

    $container.appendTo(parent);
    $container.dxTestWidget('repaint');

    expect($('.dx-test-widget')[0]).not.toBe(undefined);
    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('html tree is correct after repaint detached component', () => {
    const $container = $('#component');
    const parent = $container.parent('');
    $container.remove($container);
    $container.dxTestWidget({ text: 'test' });

    $container.appendTo(parent);
    $container.dxTestWidget('repaint');
    $container.detach();
    $container.dxTestWidget('repaint');
    $container.appendTo(parent);
    $container.dxTestWidget('repaint');

    expect($('.dx-test-widget')[0]).not.toBe(undefined);
    expect($('.dx-test-widget')[0]).toBe($('#component')[0]);
  });

  it('pass custom class and attributes (with id) as props on first render', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    $('#my-id').addClass('dx-custom-css-class');
    $('#my-id').attr('data-custom-attr', 'attr-value');

    $('#my-id').dxTestWidget({});

    expect($('#my-id').dxTestWidget('getLastPassedProps')).toMatchObject({
      id: 'my-id',
      className: 'custom-css-class dx-custom-css-class',
      class: '',
      'data-custom-attr': 'attr-value',
    });
  });

  it('pass updated custom class on repaint', () => {
    $('#component').attr('id', 'my-id');
    $('#my-id').addClass('custom-css-class');
    $('#my-id').addClass('dx-custom-css-class');
    $('#my-id').dxTestWidget({});

    $('#my-id').addClass('custom-css-class2');

    $('#my-id').dxTestWidget('instance').option('text', 'updated');

    expect($('#my-id').dxTestWidget('getLastPassedProps')).toMatchObject({
      className: 'custom-css-class dx-custom-css-class',
      class: '',
    });
  });

  it('widget does not show className option', () => {
    $('#component').addClass('custom-css-class');

    $('#component').dxTestWidget({});

    expect($('#component').dxTestWidget('option')).not.toHaveProperty('className');
  });

  it('replace id on container with id from elementAttr option', () => {
    $('#component').attr('id', 'my-id');

    $('#my-id').dxTestWidget({ elementAttr: { id: 'attr-id' } });

    expect($('#attr-id').dxTestWidget('getLastReceivedProps').id).toBe('attr-id');
  });

  it('keep elementAttr option untouched', () => {
    $('component').addClass('custom-css-class attr-class');
    $('#component').attr('data-custom-attr', 'attr-value');

    $('#component').dxTestWidget({ elementAttr: { id: 'attr-id', class: 'attr-css-class attr-class' } });

    expect($('#attr-id').dxTestWidget('option').elementAttr).toEqual({ id: 'attr-id', class: 'attr-css-class attr-class' });
  });

  it('pass style as key_value pair to props', () => {
    $('#component').css('width', '123.5px');
    $('#component').css('height', '456.6px');

    $('#component').dxTestWidget({});

    expect($('#component').dxTestWidget('getLastReceivedProps').style).toEqual({
      width: '123.5px',
      height: '456.6px',
    });
  });

  it('pass updated style on repaint', () => {
    $('#component').css('width', '123.5px');
    $('#component').css('height', '456.6px');

    $('#component').dxTestWidget({});

    $('#component').css('width', '23.5px');
    $('#component').css('height', '56.6px');
    $('#component').css('display', 'inline');

    $('#component').dxTestWidget('repaint');

    expect($('#component').dxTestWidget('getLastReceivedProps').style).toEqual({
      width: '23.5px',
      height: '56.6px',
      display: 'inline',
    });
  });

  it('component container should not change its position in parent container', () => {
    $('#components').append($('<div>')).prepend($('<div>'));

    $('#component').dxTestWidget({});

    expect($('#components').children().get(1)).toBe($('#component').get(0));
  });
});

describe('option', () => {
  it('should return default props of component', () => {
    $('#component').dxOptionsCheckWidget({});

    expect($('#component').dxOptionsCheckWidget('option').text).toBe('default text');
  });

  it('should copy default props of component (not by reference)', () => {
    document.body.innerHTML = `
      <div id="components">
          <div id="component1"></div>
          <div id="component2"></div>
      </div>
      `;

    $('#component1').dxOptionsCheckWidget({});
    $('#component2').dxOptionsCheckWidget({});

    const objectProp1 = $('#component1').dxOptionsCheckWidget('option').objectProp;
    const objectProp2 = $('#component2').dxOptionsCheckWidget('option').objectProp;

    expect(objectProp1).not.toBe(objectProp2);
  });

  it('should return default value of TwoWay prop', () => {
    $('#component').dxOptionsCheckWidget({});

    expect($('#component').dxOptionsCheckWidget('option').twoWayProp).toBe(1);
  });

  it('should return updated value of TwoWay prop', () => {
    $('#component').dxOptionsCheckWidget({});

    $('#component').dxOptionsCheckWidget('updateTwoWayPropCheck');

    expect($('#component').dxOptionsCheckWidget('option').twoWayProp).toBe(2);
  });

  it('fires optionChanged on TwoWay prop change', () => {
    const optionChanged = jest.fn();
    $('#component').dxOptionsCheckWidget({
      onOptionChanged: optionChanged,
    });

    $('#component').dxOptionsCheckWidget('updateTwoWayPropCheck');

    expect(optionChanged).toBeCalledTimes(1);
    expect(optionChanged.mock.calls[0][0]).toEqual({
      fullName: 'twoWayProp',
      name: 'twoWayProp',
      previousValue: 1,
      value: 2,
      element: $('#component').get(0),
      component: $('#component').dxOptionsCheckWidget('instance'),
    });
  });

  it('convert `undefined` to `null` or `default value`', () => {
    $('#component').dxOptionsCheckWidget({
      oneWayWithValue: 15,
      oneWayWithoutValue: 15,
      oneWayNullWithValue: 15,
      twoWayWithValue: '15',
      twoWayNullWithValue: '15',
    });

    $('#component').dxOptionsCheckWidget({
      oneWayWithValue: undefined,
      oneWayWithoutValue: undefined,
      oneWayNullWithValue: undefined,
      twoWayWithValue: undefined,
      twoWayNullWithValue: undefined,
    });

    expect($('#component').dxOptionsCheckWidget('getLastPassedProps')).toMatchObject({
      oneWayWithValue: 10,
      oneWayWithoutValue: undefined,
      oneWayNullWithValue: null,
      twoWayWithValue: '10',
      twoWayNullWithValue: null,
    });

    expect($('#component').dxOptionsCheckWidget('option')).toMatchObject({
      oneWayWithValue: undefined,
      oneWayWithoutValue: undefined,
      oneWayNullWithValue: undefined,
      twoWayWithValue: undefined,
      twoWayNullWithValue: undefined,
    });
  });

  describe('Options with Element type', () => {
    it('pass DOM node to component if provided option is jQuery wrapper', () => {
      const element = document.createElement('div');
      const wrapper = $(element);

      $('#component').dxOptionsCheckWidget({
        propWithElement: wrapper,
      });

      expect($('#component').dxOptionsCheckWidget('getLastPassedProps').propWithElement).toEqual(element);
    });

    it('leave option as is if it is not jQuery wrapper', () => {
      $('#component').dxOptionsCheckWidget({
        propWithElement: 15,
      });

      expect($('#component').dxOptionsCheckWidget('getLastPassedProps').propWithElement).toEqual(15);
    });
  });

  it('should return null for template option if it is not set', () => {
    const widget = $('#component').dxOptionsCheckWidget({}).dxOptionsCheckWidget('instance');

    expect(widget.option('contentTemplate')).toBe(null);
  });
});

describe('templates and slots', () => {
  it('pass anonymous template content as children', () => {
    $('#component').html('<span>Default slot</span>');

    $('#component').dxTemplatedTestWidget({});

    expect(($('#component').children('') as any).length).toBe(1);
    expect($('#component')[0].innerHTML).toBe('<span>Default slot</span>');
  });

  it('preserve anonymous template content element', () => {
    const element = $('<span>').html('Default slot');
    $('#component').append(element);

    $('#component').dxTemplatedTestWidget({});

    expect($('#component').children('')[0]).toBe(element[0]);
  });

  it('pass updated anonymous content on repaint', () => {
    const slotContent = $('<span>').html('Default slot');
    $('#component').append(slotContent);

    $('#component').dxTemplatedTestWidget({});
    slotContent.html('Update slot');

    $('#component').dxTemplatedTestWidget('repaint');

    expect($('#component')[0].innerHTML).toBe('<span>Update slot</span>');
  });

  it('change option when anonymous template exists', () => {
    const slotContent = $('<span>').html('Default slot');
    $('#component').append(slotContent);
    $('#component').dxTemplatedTestWidget({});

    expect(() => $('#component')
      .dxTemplatedTestWidget('instance')
      .option('someOption', 'newValue')).not.toThrow();
  });

  describe('template function parameters', () => {
    it('template without index', () => {
      const template = jest.fn();

      $('#component').dxTemplatedTestWidget({
        template,
      });

      const templateRoot = $('#component').children('.templates-root')[0];

      expect(template).toBeCalledTimes(1);
      expect(template.mock.calls[0]).toEqual([{ simpleTemplate: 'data' }, templateRoot]);
    });

    it('template with index', () => {
      const template = jest.fn();

      $('#component').dxTemplatedTestWidget({
        indexedTemplate: template,
      });

      const templateRoot = $('#component').children('.templates-root')[0];

      expect(template).toBeCalledTimes(1);
      expect(template.mock.calls[0]).toEqual([{ indexedTemplate: 'data' }, 2, templateRoot]);
    });

    it('wraps DOM nodes in "data" param with jQuery and gets public element', () => {
      const getPublicElement = jest.fn(($el) => $el.get(0));
      setPublicElementWrapper(getPublicElement);

      const template = jest.fn();
      const param1 = document.createElement('div');
      const param2 = { some: 'object' };

      $('#component').dxTemplatedTestWidget({
        elementTemplate: template,
        elementTemplatePayload: { nodeParam: param1, nonNodeParam: param2 },
      });

      expect(template).toBeCalledTimes(1);
      expect(template.mock.calls[0][0]).toMatchObject({
        nodeParam: param1, nonNodeParam: param2,
      });

      const templateRoot = $('#component').children('.templates-root')[0];
      expect(getPublicElement).toBeCalledTimes(2);
      expect(getPublicElement).toHaveBeenNthCalledWith(1, $(param1));
      expect(getPublicElement).toHaveBeenNthCalledWith(2, $(templateRoot));
    });

    it('Tempate\'s data can have null/undefined values', () => {
      const getPublicElement = jest.fn(($el) => $el.get(0));
      setPublicElementWrapper(getPublicElement);

      const template = jest.fn();

      $('#component').dxTemplatedTestWidget({
        elementTemplate: template,
        elementTemplatePayload: { nullParam: null, undefinedParam: undefined },
      });

      const templateRoot = $('#component').children('.templates-root')[0];
      expect(template.mock.calls[0]).toEqual([{
        nullParam: null,
        undefinedParam: undefined,
      }, templateRoot]);
    });
  });

  it('insert template content to templates root', () => {
    $('#component').dxTemplatedTestWidget({
      template(data, element) {
        $(element).html('<span>Template content</span>');
      },
    });

    const templateRoot = $('#component').children('.templates-root')[0];

    expect(templateRoot.innerHTML).toBe('<span>Template content</span>');
  });

  it('remove old template content between renders', () => {
    $('#component').dxTemplatedTestWidget({
      template(data, element) {
        $(element).append(`<span>Template - ${data.simpleTemplate}</span>` as any);
      },
    });
    const templateRoot = $('#component').children('.templates-root')[0];

    $('#component').dxTemplatedTestWidget({
      text: 'new data',
    });

    expect(templateRoot.innerHTML).toBe('<span>Template - new data</span>');
  });

  it('correctly change template at runtime', () => {
    const template = () => {
      const div = $('<div>');
      div.append('first custom template' as any);
      return div;
    };

    const templateNew = () => {
      const div = $('<div>');
      div.append('second custom template' as any);
      return div;
    };
    $('#component').dxTemplatedTestWidget({
      template,
    });
    const templateRoot = $('#component').children('.templates-root')[0];

    $('#component').dxTemplatedTestWidget({
      template: templateNew,
    });

    expect(templateRoot.innerHTML).toBe('<div>second custom template</div>');
  });

  it('should not replace root with template if it returns .dx-template-wrapper node', () => {
    const template = $('<div>').addClass('dx-template-wrapper').text('TemplateContent');
    $('#component').dxTemplatedTestWidget({
      template() {
        return template;
      },
    });
    const root = $('#component').children('.templates-root')[0];

    expect($(root.firstChild)[0]).toBe(template[0]);
  });
});

describe('events/actions', () => {
  it('wraps event props with Actions with declared actionConfig', () => {
    const onEventProp = jest.fn();
    $('#component').dxTestWidget({
      onEventProp,
      beforeActionExecute: (_, action, actionConfig) => action(actionConfig),
    });

    $('#component').dxTestWidget('eventPropCheck', 'payload');

    expect($('#component').dxTestWidget('option').onEventProp).toBe(onEventProp);
    expect(onEventProp.mock.calls[0][0].someConfigs).toBe('action-config');
    expect(onEventProp.mock.calls[1][0]).toEqual({
      actionValue: 'payload',
      component: $('#component').dxTestWidget('instance'),
      element: $('#component').get(0),
    });
  });

  it('wraps DOM nodes in event args with jQuery and gets public element', () => {
    const getPublicElement = jest.fn(($el) => $el.get(0));
    setPublicElementWrapper(getPublicElement);

    const onEventProp = jest.fn();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element3 = { some: 'object' };
    const element4 = null;
    $('#component').dxTestWidget({
      onEventProp,
    });

    $('#component').dxTestWidget('eventPropCheck', {
      eventElement: element1,
      wrappedField: element2,
      nonWrappedField: element3,
      emptyField: element4,
    });

    expect(onEventProp.mock.calls[0][0]).toMatchObject({
      eventElement: element1,
      wrappedField: element2,
      nonWrappedField: element3,
      emptyField: element4,
      element: $('#component').get(0),
    });

    expect(getPublicElement).toBeCalledTimes(3);
    expect(getPublicElement).toHaveBeenNthCalledWith(1, $(element1));
    expect(getPublicElement).toHaveBeenNthCalledWith(2, $(element2));
    expect(getPublicElement).toHaveBeenNthCalledWith(3, $('#component'));
  });

  it('re-wraps event props if it is changed', () => {
    const onEventProp1 = jest.fn();
    const onEventProp2 = jest.fn();
    $('#component').dxTestWidget({
      onEventProp: onEventProp1,
    });

    $('#component').dxTestWidget({
      onEventProp: onEventProp2,
    });

    $('#component').dxTestWidget('eventPropCheck', 'payload');

    expect($('#component').dxTestWidget('option').onEventProp).toBe(onEventProp2);
    expect(onEventProp1).toBeCalledTimes(0);
    expect(onEventProp2).toBeCalledTimes(1);
    expect(onEventProp2.mock.calls[0][0]).toEqual({
      actionValue: 'payload',
      component: $('#component').dxTestWidget('instance'),
      element: $('#component').get(0),
    });
  });
});

describe('registerKeyHandler', () => {
  it('call custom handler only', () => {
    const customHandler = jest.fn();
    const propHandler = jest.fn();
    $('#component').dxTestWidget({
      onKeyDown: propHandler,
    });
    const instance = $('#component').dxTestWidget('instance');

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
    $('#component').dxTestWidget({
      onKeyDown: propHandler,
    });
    const instance = $('#component').dxTestWidget('instance');

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
    $('#component').dxTestWidget({
      onKeyDown: propHandler,
    });
    const instance = $('#component').dxTestWidget('instance');

    instance.registerKeyHandler('space', customHandler);

    emitKeyboard(KEY.enter);

    expect(customHandler).toHaveBeenCalledTimes(0);

    expect(propHandler).toHaveBeenCalledTimes(1);
    expect(propHandler).toHaveBeenCalledWith(defaultEvent,
      { originalEvent: defaultEvent, keyName: KEY.enter, which: KEY.enter });
  });
});

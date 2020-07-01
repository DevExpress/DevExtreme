import { act } from 'preact/test-utils';
import $ from '../../../js/core/renderer';
import { dasherize } from '../../../js/core/utils/inflector';

import '../../../js/bundles/modules/parts/widgets-renovation';
import widgetsMeta from './widgets.json';

import '../utils/jest-matchers';

/**
 * List of registered jQuery widgets which were created only to be used from old DevExtreme code
 */
const PRIVATE_JQUERY_WIDGETS = ['TooltipItemLayout'];

const widgets: Array<[string, typeof widgetsMeta[0]]> = widgetsMeta
  .filter((meta) => PRIVATE_JQUERY_WIDGETS.indexOf(meta.name) === -1)
  .map((meta) => [`dxr${meta.name}`, meta]);

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

describe('Mandatory component setup', () => {
  it.each(widgets)('%s - should have dx-widget css class', (widgetName) => {
    const message = 'You should always set `dx-widget` class to the rooot of your component';

    act(() => $('#component')[widgetName]({}));

    expect($('#component').get(0)).toBeWithMessage($('.dx-widget').get(0), message);
  });

  it.each(widgets)('%s - pass restAttributes to component\'s root', (widgetName: string) => {
    const message = 'You should pass restAttributes to the component\'s root\n'
    + '<root {...viewModel.restAttributes} />';

    act(() => $('#component')[widgetName]({
      'data-custom-option': 'custom-value',
    }));

    expect($('#component').attr('data-custom-option')).toBeWithMessage('custom-value', message);
  });

  it.each(widgets)('%s - merge own classes with className from restAttributes', (widgetName, meta) => {
    const message = 'You should merge your cssClass with className from restAttributes\n'
    + '<root className={viewModel.className} />\n'
    + 'get className() { return \`${this.restAttributes.className} dx-my-component\` }'; // eslint-disable-line

    $('#component').addClass('custom-class');
    act(() => $('#component')[widgetName]({}));

    expect($('#component').get(0)).toBeWithMessage($(`.custom-class.dx-${dasherize(meta.name)}`).get(0), message);
  });

  it.each(widgets)('%s - pass style to component\'s root', (widgetName) => {
    const message = 'If you do not specify style in your component just spread restAttributes\n'
    + '<root {...viewModel.restAttributes} />\n\n'
    + 'If you specify some styles then merge it with restAttributes.style object\n'
    + '<root style={viewModel.styles} />\n'
    + 'get styles() { return { ...this.restAttributes.style, display: "inline" }; }';

    $('#component').css({
      width: '100px', height: '50px', color: 'red',
    });

    act(() => $('#component')[widgetName]({}));

    expect($('#component').css('width')).toBeWithMessage('100px', message);
    expect($('#component').css('height')).toBeWithMessage('50px', message);
    expect($('#component').css('color')).toBeWithMessage('red', message);
  });

  it.each(widgets.filter((m) => m[1].props.allProps.indexOf('width') !== -1 && m[1].props.allProps.indexOf('width') !== -1))('%s - width/height options take priority over container size', (widgetName) => {
    const message = 'If your component has width/height props, they should overwrite width/height properties in restAttributes.style\n'
    + '<root style={viewModel.styles} />\n'
    + 'get styles() {\n'
    + '  return {\n'
    + '    ...this.restAttributes.style,\n'
    + '    width: this.props.width,\n'
    + '    height: this.props.height,\n'
    + '  };\n'
    + '}';

    $('#component').css({
      width: '100px', height: '50px',
    });

    act(() => $('#component')[widgetName]({
      width: '110px',
      height: '55px',
    }));

    expect($('#component').css('width')).toBeWithMessage('110px', message);
    expect($('#component').css('height')).toBeWithMessage('55px', message);
  });

  it.each(widgets.filter((m) => m[1].props.template.length))('%s - pass right props to templates', (widgetName, meta) => {
    const message = 'For templates that jQuery users set.\n'
    + 'You should pass only `data` and `index` (if applicable) props\n'
    + 'when rendering template.\n'
    + '<div>\n'
    + '  {viewModel.props.template &&\n'
    + '    <viewModel.props.template\n'
    + '      data={viewModel.templateData}\n'
    + '      index={1}\n'
    + '    />}\n'
    + '  {!viewModel.props.template && \'default content\'}\n'
    + '</div>\n\n'
    + 'If for some reason you don\'t have data (if it is based on other props) - exclude your component from the test below\n'
    + 'and add correspondig tests in your component\'s test suite.';
    expect.assertions(meta.props.template.length * 3);

    const options: { [name: string]: jest.Mock } = meta.props.template.reduce((r, template) => ({
      ...r,
      [template]: jest.fn(),
    }), {});

    act(() => $('#component')[widgetName](options));

    meta.props.template.forEach((template) => {
      const [data, index, element = index] = options[template].mock.calls[0];

      expect($('#component').get(0).contains(element)).toBeWithMessage(true, message);
      expect(element === index || (typeof index === 'number')).toBeWithMessage(true, message);
      expect(typeof data === 'object').toBeWithMessage(true, message);
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { act } from 'preact/test-utils';
import $ from '../../../js/core/renderer';
// import { dasherize } from '../../../js/core/utils/inflector';

import '../../../js/bundles/modules/parts/widgets-renovation';
import widgetsMeta from './widgets.json';

const widgets: Array<[string, typeof widgetsMeta[0]]> = widgetsMeta.map((meta) => [`dxr${meta.name}`, meta]);

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
  /**
   * You should pass restAttributes to the component's root
   * <root {...viewModel.restAttributes} />
   */
  it.each(widgets)('%s - pass restAttributes to component\'s root', (widgetName: string) => {
    act(() => $('#component')[widgetName]({
      'data-custom-option': 'custom-value',
    }));

    expect($('#component').attr('data-custom-option')).toBe('custom-value');
  });

  /**
   * You should merge your cssClass with className from restAttributes
   * <root className={viewModel.className} />
   * get className() { return `${this.restAttributes.className} dx-my-component` }
   */
  it.each(widgets)('%s - merge own classes with className from restAttributes', (widgetName) => {
    $('#component').addClass('custom-class');
    act(() => $('#component')[widgetName]({}));

    const classes: string[] = $('#component').attr('class').split(' ');
    expect(classes.indexOf('custom-class')).not.toBe(-1);
    expect(classes.some((css) => /^dx-/.test(css))).not.toBe(-1);

    // expect($('#component').get(0)).toBe($(`.custom-class.dx-${dasherize(meta.name)}`).get(0));
  });

  /**
   * If you do not specify style in your component just spread restAttributes
   * <root {...viewModel.restAttributes} />
   *
   * If you specife some styles then merge it with restAttributes.style object
   * <root style={viewModel.styles} />
   * get styles() { return { ...this.restAttributes.style, display: 'inline' }; }
   */
  it.each(widgets)('%s - pass style to component\'s root', (widgetName) => {
    $('#component').css({
      width: '100px', height: '50px', color: 'red',
    });

    act(() => $('#component')[widgetName]({}));

    expect($('#component').css('width')).toBe('100px');
    expect($('#component').css('height')).toBe('50px');
    expect($('#component').css('color')).toBe('red');
  });

  /**
   * If your component has width/height props,
   * they should overwrite width/height properties in restAttributes.style
   * <root style={viewModel.styles} />
   * get styles() {
   *     return {
   *         ...this.restAttributes.style,
   *         width: this.props.width,
   *         height: this.props.height
   *     };
   * }
   */
  it.each(widgets.filter((m) => m[1].props.allProps.indexOf('width') !== -1 && m[1].props.allProps.indexOf('width') !== -1))('%s - width/height options take priority over container size', (widgetName) => {
    $('#component').css({
      width: '100px', height: '50px',
    });

    act(() => $('#component')[widgetName]({
      width: '110px',
      height: '55px',
    }));

    expect($('#component').css('width')).toBe('110px');
    expect($('#component').css('height')).toBe('55px');
  });

  /**
   * For templates that jQuery users set.
   * You should pass only 'data', 'parentRef' and 'index' (if applicable) props
   * when rendering template.
   * 'parentRef' is the ref to the parent element of template
   * <div ref={viewModel.divRef}>
   *   {viewModel.props.template &&
   *     <viewModel.props.template
   *       data={viewModel.templateData}
   *       index={1}
   *       parentRef={viewModel.divRef}
   *     />}
   *   {!viewModel.props.template && 'default content'}
   * </div>
   *
   * If for some reason you don't have parentRef (e.g. parentRef is input prop),
   * or data (if it is based on other props) - exclude your component from the test below
   * and add correspondig tests in your component's test suite.
   */
  it.each(widgets.filter((m) => ['dxrTooltipItemLayout'].indexOf(m[0]) === -1 && m[1].props.template.length))('%s - pass right props to templates', (widgetName, meta) => {
    expect.assertions(meta.props.template.length * 3);

    const options: { [name: string]: jest.Mock } = meta.props.template.reduce((r, template) => ({
      ...r,
      [template]: jest.fn(),
    }), {});

    act(() => $('#component')[widgetName](options));

    meta.props.template.forEach((template) => {
      const [data, index, element = index] = options[template].mock.calls[0];
      expect($('#component').find(element).get(0)).toBe(element);
      expect(element === index || (typeof index === 'number')).toBe(true);
      expect(typeof data === 'object').toBe(true);
    });
  });
});

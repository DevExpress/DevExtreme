import { render as testingRender, cleanup } from '@testing-library/react';
import * as React from 'react';
import config, { getOption } from '../config';
import {
  TestComponent,
  WidgetClass,
} from './test-component';

class ComponentWithTemplates extends TestComponent {
  protected _templateProps = [{
    tmplOption: 'item',
    render: 'itemRender',
    component: 'itemComponent',
    keyFn: 'itemKeyFn',
  }];
}

describe('useLegacyTemplateEngine', () => {
  const originalValue = getOption('useLegacyTemplateEngine');

  beforeEach(() => {
    config({ useLegacyTemplateEngine: true });
  });

  afterEach(() => {
    config({ useLegacyTemplateEngine: originalValue });
    WidgetClass.mockClear();
    cleanup();
  });

  it('works for render-function template', () => {
    const ItemTemplate = (data: any) => (
      <div className="template">
        value:
        {' '}
        {data.value}
        , key:
        {' '}
        {data.key}
        , dxkey:
        {' '}
        {data.dxkey}
      </div>
    );
    const ref = React.createRef() as React.RefObject<HTMLDivElement>;

    const { container } = testingRender(
      <ComponentWithTemplates itemRender={ItemTemplate}>
        <div ref={ref} />
      </ComponentWithTemplates>,
    );

    const { render } = WidgetClass.mock.calls[0][1].integrationOptions.templates.item;

    render({
      container: ref.current,
      model: { value: 'Value', key: 'key_1' },
    });
    expect(container.querySelector('.template')?.textContent).toBe('value: Value, key: key_1, dxkey: key_1');
  });

  it('works for component template', () => {
    const ItemTemplate = (props: any) => {
      const { value, dxkey } = props;
      return (
        <div className="template">
          value:
          {' '}
          {value}
          , dxkey:
          {' '}
          {dxkey}
        </div>
      );
    };

    const ref = React.createRef() as React.RefObject<HTMLDivElement>;

    const { container } = testingRender(
      <ComponentWithTemplates itemComponent={ItemTemplate}>
        <div ref={ref} />
      </ComponentWithTemplates>,
    );

    const { render } = WidgetClass.mock.calls[0][1].integrationOptions.templates.item;

    render({
      container: ref.current,
      model: { value: 'Value', key: 'key_1' },
    });
    expect(container.querySelector('.template')?.textContent).toBe('value: Value, dxkey: key_1');
  });
});

import * as React from 'react';
import { TemplateManager } from '../template-manager';
import { cleanup, render, act, screen } from '@testing-library/react';
import * as config from '../config';
import * as events from 'devextreme/events';
import { InitArgument } from '../types';

type TemplateComponentProps = {
  data?: { text: string, effect?: () => void };
  dxkey?: string;
};

const TemplateComponent: React.FC<TemplateComponentProps> = function TemplateComponent({ data, dxkey }) {
  data?.effect?.();

  return (
    <div className='component-template'>{data?.text}{dxkey}</div>
  );
};

function getTemplateOptions(args: { type, effect?, content? }[]) {
  const options = {} as any;

  if (args.some(arg => arg.type === 'children')) {
    options.childrenKey = {
      type: 'children',
      content: <div className='child-template'>Children template</div>,
    }
  }

  if (args.some(arg => arg.type === 'render')) {
    const arg = args.find(arg => arg.type === 'render')!;

    options.renderKey = {
      type: 'render',
      content: arg.content ?? ((data, index) => {
        arg.effect?.();

        return (
          <div className='render-template'>{`${data.text}-${index}`}</div>
        )
      }),
    }
  }

  if (args.some(arg => arg.type === 'component')) {
    options.componentKey = {
      type: 'component',
      content: TemplateComponent,
    }
  }

  return options;
}

describe('Template Manager', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('template manager renders nothing without "render" calls', () => {

    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'children' }, { type: 'render' }, { type: 'component' }]);

    render(
      <React.Fragment>
        <div className='children-template-container'></div>
        <div className='render-template-container'></div>
        <div className='component-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(createDXTemplates).toBeTruthy();

    act(() => { createDXTemplates(templateOptions); });

    expect(document.querySelector('.child-template')).toBeNull();
    expect(document.querySelector('.render-template')).toBeNull();
    expect(document.querySelector('.component-template')).toBeNull();
  })

  it('dxtemplate creator generates correct templates', () => {
    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'children' }, { type: 'render' }, { type: 'component' }]);

    render(
      <React.Fragment>
        <div className='children-template-container'></div>
        <div className='render-template-container'></div>
        <div className='component-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(createDXTemplates).toBeTruthy();

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    let childrenTemplateRendered, renderTemplateRendered, componentTemplateRendered;

    act(() => dxTemplates.childrenKey.render({
      model: {},
      index: 1,
      container: document.querySelector('.children-template-container'),
      onRendered: () => { childrenTemplateRendered = true; }
    }));

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
      onRendered: () => { renderTemplateRendered = true; }
    }));

    act(() => dxTemplates.componentKey.render({
      model: { text: 'Component template text' },
      index: 3,
      container: document.querySelector('.component-template-container'),
      onRendered: () => { componentTemplateRendered = true; }
    }));

    expect(document.querySelector('.children-template-container')?.innerHTML)
      .toBe('<div class="child-template">Children template</div><div style="display: none;"></div>');
    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-2</div><div style="display: none;"></div>');
    expect(document.querySelector('.component-template-container')?.innerHTML)
      .toBe('<div class="component-template">Component template text</div><div style="display: none;"></div>');

    expect(childrenTemplateRendered && renderTemplateRendered && componentTemplateRendered).toBeTruthy();
  });

  it('unwraps jquery containers', () => {
    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'render' }]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(createDXTemplates).toBeTruthy();

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: {
        get: (idx: number): HTMLElement => {
          if (idx !== 0)
            throw new Error('incorrect unwrap');

          return document.querySelector('.render-template-container')!;
        } 
      },
      onRendered: () => undefined,
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-2</div><div style="display: none;"></div>');
  });

  it('does not render template instances if the template prop has been removed but instance removal is delayed (T1208518)', () => {
    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    let templateOptions = getTemplateOptions([{ type: 'render' }]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <div className='component-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
      onRendered: () => undefined,
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-2</div><div style="display: none;"></div>');
    expect(document.querySelector('.component-template-container')?.innerHTML)
      .toBe('');

    templateOptions = getTemplateOptions([{ type: 'component' }]);

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.componentKey.render({
      model: { text: 'Component template text' },
      index: 3,
      container: document.querySelector('.component-template-container'),
      onRendered: () => undefined,
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('');
    expect(document.querySelector('.component-template-container')?.innerHTML)
      .toBe('<div class="component-template">Component template text</div><div style="display: none;"></div>');
  });

  it('template wrappers are memoized', () => {
    let componentTemplateRenderCount = 0;
    let functionTemplateRenderCount = 0;

    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'render', effect: () => functionTemplateRenderCount++ }, { type: 'component' }]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <div className='component-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(createDXTemplates).toBeTruthy();

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
      onRendered: () => undefined,
    }));

    act(() => dxTemplates.componentKey.render({
      model: { text: 'Component template text', effect: () => componentTemplateRenderCount++ },
      index: 3,
      container: document.querySelector('.component-template-container'),
      onRendered: () => undefined,
    }));

    expect(functionTemplateRenderCount).toBe(1);
    expect(componentTemplateRenderCount).toBe(1);
  });

  it('props are normalized for render and component templates', () => {
    jest.spyOn(config, 'getOption')
      .mockImplementation(optionName => {
        if (optionName === 'useLegacyTemplateEngine')
          return true;
        else
          throw new Error('Unknown config option requested!');
      });

    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'component' }, { type: 'render', content: (data) => <div className='render-template'>{data.dxkey}</div> }])

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <div className='component-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: {
        text: 'Render template text',
        key: 'render-data-key',
      },
      index: 2,
      container: document.querySelector('.render-template-container'),
    }));

    act(() => dxTemplates.componentKey.render({
      model: {
        text: 'Component template text',
        key: 'component-data-key',
      },
      index: 3,
      container: document.querySelector('.component-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">render-data-key</div><div style="display: none;"></div>');
    expect(document.querySelector('.component-template-container')?.innerHTML)
      .toBe('<div class="component-template">component-data-key</div><div style="display: none;"></div>');
  });

  it('onRendered is not called if the template was rendered by a previous widget instance (StrictMode)', () => {
    let createDXTemplates, clearInstantiationModels;
    let emulateWidgetRecreationOnRender = true;

    const init = ({
      createDXTemplates: createDXTemplatesFn,
      clearInstantiationModels: clearInstantiationModelsFn
    }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
      clearInstantiationModels = clearInstantiationModelsFn
    };

    const templateOptions = getTemplateOptions([{ type: 'render', effect: () => {
      if (emulateWidgetRecreationOnRender) {
        clearInstantiationModels();
      }
    }}]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;
    let renderTemplateRendered = false;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
      onRendered: () => { renderTemplateRendered = true; }
    }));

    expect(screen.queryAllByText('Render template text').length).toBe(0);
    expect(renderTemplateRendered).toBeFalsy();

    emulateWidgetRecreationOnRender = false;

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
      onRendered: () => { renderTemplateRendered = true; }
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-2</div><div style="display: none;"></div>');
    expect(renderTemplateRendered).toBeTruthy();
  });

  it('update callback re-renderers template manager', () => {
    let createDXTemplates;
    let updateTemplates;


    const init = ({
      createDXTemplates: createDXTemplatesFn,
      updateTemplates: updateTemplatesFn
    }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
      updateTemplates = updateTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'render' }]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 2,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-2</div><div style="display: none;"></div>');

    const newTemplateOptions = {
      renderKey: {
        type: 'render',
        content: (data) => {
          return (
            <div className='new-render-template'>{data.text}</div>
          );
        },
      },
    };

    let callbackCalled = false;

    act(() => {
      dxTemplates = createDXTemplates(newTemplateOptions);
      updateTemplates(() => { callbackCalled = true; });
    });

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="new-render-template">Render template text</div><div style="display: none;"></div>');
    expect(callbackCalled).toBeTruthy();
  });

  it('replaces templates with matching keys, adds templates with new keys', () => {
    let createDXTemplates;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'render' }]);

    render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <div className='other-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;

    const data1 = { text: 'Render template text' };
    const data2 = { text: 'Some other text' };

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: data1,
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-1</div><div style="display: none;"></div>');

    act(() => dxTemplates.renderKey.render({
      model: data1,
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-1</div><div style="display: none;"></div>');
    
    act(() => dxTemplates.renderKey.render({
      model: data2,
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe(''.concat('<div class="render-template">Render template text-1</div><div style="display: none;"></div>',
        '<div class="render-template">Some other text-1</div><div style="display: none;"></div>'));

    act(() => dxTemplates.renderKey.render({
      model: data2,
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe(''.concat('<div class="render-template">Render template text-1</div><div style="display: none;"></div>',
        '<div class="render-template">Some other text-1</div><div style="display: none;"></div>'));

    act(() => dxTemplates.renderKey.render({
      model: data2,
      index: 1,
      container: document.querySelector('.other-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe(''.concat('<div class="render-template">Render template text-1</div><div style="display: none;"></div>',
        '<div class="render-template">Some other text-1</div><div style="display: none;"></div>'));
    expect(document.querySelector('.other-container')?.innerHTML)
      .toBe('<div class="render-template">Some other text-1</div><div style="display: none;"></div>');
  });

  it('template is removed if the container was removed during render', () => {
    let createDXTemplates;
    let removeContainerDuringRender = true;

    const init = ({ createDXTemplates: createDXTemplatesFn }: InitArgument) => {
      createDXTemplates = createDXTemplatesFn;
    };

    const templateOptions = getTemplateOptions([{ type: 'render', effect: () => {
      if (removeContainerDuringRender) {
        events.triggerHandler(document.querySelector('.render-template-container')!, 'dxremove');
        removeContainerDuringRender = false;
      }
    }}]);

    const { rerender } = render(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    let dxTemplates;

    act(() => { dxTemplates = createDXTemplates(templateOptions); });

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('');

    rerender(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('');

    act(() => dxTemplates.renderKey.render({
      model: { text: 'Render template text' },
      index: 1,
      container: document.querySelector('.render-template-container'),
    }));

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-1</div><div style="display: none;"></div>');

    rerender(
      <React.Fragment>
        <div className='render-template-container'></div>
        <TemplateManager init={init} onTemplatesRendered={() => undefined} />
      </React.Fragment>
    );

    expect(document.querySelector('.render-template-container')?.innerHTML)
      .toBe('<div class="render-template">Render template text-1</div><div style="display: none;"></div>');
  });
});

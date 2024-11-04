import * as React from 'react';
import { useEffect, useContext } from 'react';
import { TemplateWrapper } from '../template-wrapper';
import { cleanup, render } from '@testing-library/react';
import * as events from 'devextreme/events';
import { RemovalLockerContext, UpdateLocker } from '../contexts';
import { TemplateFunc } from '../types';

function TemplateComponent(args: { data, index, onRendered?, effect? }) {
  const { data, index, onRendered, effect } = args;

  effect?.();

  useEffect(() => {
    onRendered?.();
  }, [onRendered]);

  return (
    <div className='template-element'>{`${data.text} - ${index}`}</div>
  );
}

function getComponentTemplateFunction(effect?) {
  return ({ data, index, onRendered }) => {
    return (
      <TemplateComponent
        data={data}
        index={index}
        onRendered={onRendered}
        effect={effect}
      />
    );
  };
}

const textTemplateFunction: TemplateFunc = ({ data, index }) => {
  return `${data.text} - ${index}`;
};

describe('Template Wrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('works with locker in the context correctly', () => {
    let onRemovedFired = false;
    let removalLocker: UpdateLocker | undefined = undefined;

    const onRemoved = () => {
      onRemovedFired = true;
    };

    const templateEffect = () => {
      const locker = useContext(RemovalLockerContext);

      removalLocker = locker;
    }
  
    const templateFunction = getComponentTemplateFunction(templateEffect);

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={1}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    removalLocker = removalLocker as any as UpdateLocker;

    expect(removalLocker).not.toBeNull();

    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeTruthy();

    onRemovedFired = false;
    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={2}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    removalLocker.lock();
    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeFalsy();

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={3}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    removalLocker.lock();
    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeFalsy();

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={4}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    removalLocker.unlock();
    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeTruthy();
  });

  it('does not fire onRemove when the event comes from wrappers', () => {
    let onRemovedFired = false;

    const onRemoved = () => {
      onRemovedFired = true;
    };
  
    const templateFunction = getComponentTemplateFunction();

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={1}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={(onRemoved)}
        />
      </>
    );

    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove', { isUnmounting: true });

    expect(onRemovedFired).toBeFalsy();

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          key={2}
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={(onRemoved)}
        />
      </>
    );

    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeTruthy();
  });

  it('adds hidden node', () => {
    const templateFunction: TemplateFunc = getComponentTemplateFunction();

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={() => undefined}
        />
      </>
    );

    expect(document.querySelector('.template-container')?.outerHTML)
      .toBe('<div class="template-container"><div class="template-element">My template - 1</div><div style="display: none;"></div></div>');
  });

  it('chooses hidden node element type correctly', () => {
    const templateFunction: TemplateFunc = getComponentTemplateFunction();

    function TableBodyComponent({ data, index }) {
      return (
        <tbody className='tbody-template-element'>
          <tr>
            <td>
              {`${data.text} - ${index}`}
            </td>
          </tr>
        </tbody>
      );
    }

    function TableRowComponent({ data, index }) {
      return (
        <tr className='tr-template-element'>
          <td>
            {`${data.text} - ${index}`}
          </td>
        </tr>
      );
    }
  
    const tableBodyTemplateFunction: TemplateFunc = ({ data, index }) => {
      return (
        <TableBodyComponent
          data={data}
          index={index}
        />
      );
    };

    const tableRowTemplateFunction: TemplateFunc = ({ data, index }) => {
      return (
        <TableRowComponent
          data={data}
          index={index}
        />
      );
    };

    const { rerender } = render(
      <>
        <div className='div-container' />
        <table className='table-container'>
        </table>
        <table>
          <tbody className='tbody-container' />
        </table>
      </>
    );

    rerender(
      <>
        <div className='div-container' />
        <table className='table-container'>
        </table>
        <table>
          <tbody className='tbody-container' />
        </table>
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.div-container')!}
          onRemoved={() => undefined}
        />
        <TemplateWrapper
          templateFactory={tableBodyTemplateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.table-container')!}
          onRemoved={() => undefined}
        />
        <TemplateWrapper
          templateFactory={tableRowTemplateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.tbody-container')!}
          onRemoved={() => undefined}
        />
      </>
    );

    expect(document.querySelector('.div-container')?.outerHTML)
      .toBe('<div class="div-container"><div class="template-element">My template - 1</div><div style="display: none;"></div></div>');
    expect(document.querySelector('.table-container')?.outerHTML)
      .toBe('<table class="table-container"><tbody class="tbody-template-element"><tr><td>My template - 1</td></tr></tbody><tbody style="display: none;"></tbody></table>');
    expect(document.querySelector('.tbody-container')?.outerHTML)
      .toBe('<tbody class="tbody-container"><tr class="tr-template-element"><td>My template - 1</td></tr><tr style="display: none;"></tr></tbody>');
  });

  it('adds removal listener for text templates', () => {
    const templateFunction: TemplateFunc = textTemplateFunction;

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={() => undefined}
        />
      </>
    );

    expect(document.querySelector('.template-container')?.outerHTML)
      .toBe('<div class="template-container">My template - 1<div style="display: none;"></div><span style="display: none;"></span></div>');
  });

  it('triggers onRemove when the element is removed', () => {
    let onRemovedFired = false;

    const onRemoved = () => {
      onRemovedFired = true;
    };
  
    const templateFunction: TemplateFunc = getComponentTemplateFunction();

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    expect(onRemovedFired).toBeFalsy();

    events.triggerHandler(document.querySelector('.template-element')!, 'dxremove');

    expect(onRemovedFired).toBeTruthy();
  });

  it('removes text templates when the removal listener is removed', () => {
    let onRemovedFired = false;

    const onRemoved = () => {
      onRemovedFired = true;
    };

    const templateFunction: TemplateFunc = textTemplateFunction;

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={onRemoved}
        />
      </>
    );

    expect(onRemovedFired).toBeFalsy();

    const containerChildren = document.querySelector('.template-container')?.children!;

    for(var i = 0; i < containerChildren?.length; i++) {
      events.triggerHandler(containerChildren[i], 'dxremove');
    }

    expect(onRemovedFired).toBeTruthy();
  });

  it('returns all the elements to DOM on unmount to avoid upsetting React', () => {
    const templateFunction: TemplateFunc = getComponentTemplateFunction();

    const { rerender, unmount } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={() => undefined}
        />
      </>
    );

    const container = document.querySelector('.template-container')!;
    const children = container.children;

    for(var i = 0; i < children.length; i++) {
      container.removeChild(children[i]);
    }

    expect(() => unmount()).not.toThrow();
  });

  it('portals its component to the specified container', () => {
    const templateFunction: TemplateFunc = getComponentTemplateFunction();

    const { rerender } = render(
      <>
        <div className='template-container' />
      </>
    );

    rerender(
      <>
        <div className='template-container' />
        <TemplateWrapper
          templateFactory={templateFunction}
          data={{ text: 'My template' }}
          index={1}
          onRendered={() => undefined}
          container={document.querySelector('.template-container')!}
          onRemoved={() => undefined}
        />
      </>
    );

    expect(document.querySelector('.template-container')?.querySelector('.template-element')).not.toBeNull();
  });
});

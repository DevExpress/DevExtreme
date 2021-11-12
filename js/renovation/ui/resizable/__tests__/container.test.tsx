/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { ResizableContainer, viewFunction } from '../container';
import { ResizableHandle } from '../handle';
import { triggerResizeEvent } from '../../../../events/visibility_change';
import { defaultEvent } from '../../../test_utils/events_mock';

jest.mock('../../../../events/visibility_change', () => ({
  triggerResizeEvent: jest.fn(),
}));

describe('ResizableContainer', () => {
  describe('View', () => {
    it('should render children', () => {
      const container = shallow(viewFunction({
        handles: [],
        props: { children: <div id="child" /> },
      } as any));
      expect(container.find('#child').exists()).toBe(true);
    });

    it('should pass handle type to the onHandleResizeStart callback', () => {
      const onHandleResizeStart = jest.fn();
      const container = shallow(viewFunction({ onHandleResizeStart, handles: ['top'], props: {} } as any));
      const handle = container.find(ResizableHandle);
      const event = { dragEvent: true };

      handle.props().onResizeStart(event);

      expect(onHandleResizeStart).toHaveBeenCalledTimes(1);
      expect(onHandleResizeStart).toHaveBeenCalledWith(event, 'top');
    });

    it('should pass handle type to the onHandleResize callback', () => {
      const onHandleResize = jest.fn();
      const container = shallow(viewFunction({ onHandleResize, handles: ['top'], props: {} } as any));
      const handle = container.find(ResizableHandle);
      const event = { dragEvent: true };

      handle.props().onResize(event);

      expect(onHandleResize).toHaveBeenCalledTimes(1);
      expect(onHandleResize).toHaveBeenCalledWith(event, 'top');
    });

    it('should pass handle type to the onHandleResizeEnd callback', () => {
      const onHandleResizeEnd = jest.fn();
      const container = shallow(viewFunction({ onHandleResizeEnd, handles: ['top'], props: {} } as any));
      const handle = container.find(ResizableHandle);
      const event = { dragEvent: true };

      handle.props().onResizeEnd(event);

      expect(onHandleResizeEnd).toHaveBeenCalledTimes(1);
      expect(onHandleResizeEnd).toHaveBeenCalledWith(event, 'top');
    });

    it('should spread restAttributes', () => {
      const container = shallow(viewFunction({
        props: {},
        handles: [],
        restAttributes: { 'custom-attribute': 'customAttribute' },
      } as any));
      expect(container.prop('custom-attribute')).toBe('customAttribute');
    });

    it('should render handles', () => {
      const container = shallow(viewFunction({ handles: ['handle1', 'handle2'], props: { disabled: true } } as any));
      const handleComponents = container.find(ResizableHandle);
      expect(handleComponents.length).toBe(2);
      expect(handleComponents.at(0).props().direction).toBe('handle1');
      expect(handleComponents.at(1).props().direction).toBe('handle2');
      expect(handleComponents.at(0).props().disabled).toBe(true);
      expect(handleComponents.at(1).props().disabled).toBe(true);
    });

    it('should render main element "style" and "className"', () => {
      const resizable = shallow(viewFunction({
        props: {},
        handles: [],
        styles: { width: 10, height: 10 },
        cssClasses: 'resizable-cusom-class1 resizable-cusom-class2',
        children: null,
      } as any));
      const mainEl = resizable.find('div');

      expect(mainEl.is('.resizable-cusom-class1.resizable-cusom-class2')).toBe(true);
      expect(mainEl.prop('style')).toEqual({ width: 10, height: 10 });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      it('should define mainRef property', () => {
        const outsideMinRef = { current: {} };
        const insideMainRefEl = {};
        const container = new ResizableContainer({ mainRef: outsideMinRef } as any);
        container.mainContainerRef = { current: insideMainRefEl } as any;

        container.forwardRefInitEffect();
        expect(outsideMinRef.current).toBe(insideMainRefEl);
      });

      it('should ignore undefined mainRef', () => {
        const container = new ResizableContainer({} as any);
        container.mainContainerRef = { current: {} } as any;

        expect(() => container.forwardRefInitEffect()).not.toThrow();
      });
    });

    describe('Events', () => {
      describe('onResizeStart', () => {
        it('should store current mouse position', () => {
          const onResizeStart = jest.fn();
          const container = new ResizableContainer({ onResizeStart });
          const event = { dragEvent: true, clientX: 33, clientY: 44 };

          expect(container.startX).toEqual(Number.NaN);
          expect(container.startY).toEqual(Number.NaN);
          container.onHandleResizeStart(event as any, 'top');
          expect(container.startX).toEqual(33);
          expect(container.startY).toEqual(44);
        });

        it('should reset targetElements field', () => {
          const onResizeStart = jest.fn();
          const container = new ResizableContainer({ onResizeStart });
          const event = { dragEvent: true };

          container.onHandleResizeStart(event as any, 'top');

          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResizeStart).toHaveBeenCalledWith({ event, handle: 'top' });
          expect((event as any).targetElements).toEqual([]);
        });

        it('should change "isResizable" state value', () => {
          const container = new ResizableContainer({});

          expect(container.isResizing).toBe(false);
          container.onHandleResizeStart({} as any, 'top');
          expect(container.isResizing).toBe(true);
        });
      });

      describe('onResize', () => {
        it('should trigger resize event', () => {
          const onResize = jest.fn();
          const mainEl = { el: true };
          const container = new ResizableContainer({
            onResize,
            mainRef: { current: mainEl },
          } as any);
          const event = { dragEvent: true };

          container.mainContainerRef = { current: mainEl } as any;
          container.onHandleResize(event as any, 'top');

          expect(onResize).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledWith({
            event, handle: 'top', delta: { x: Number.NaN, y: Number.NaN },
          });
          expect(triggerResizeEvent).toHaveBeenCalledTimes(1);
          expect(triggerResizeEvent).toHaveBeenCalledWith(mainEl);
        });

        it('should calculate and pass delta values', () => {
          const onResize = jest.fn();
          const container = new ResizableContainer({ onResize });
          container.startX = 10;
          container.startY = 50;
          container.mainContainerRef = { current: {} } as any;
          const event = { dragEvent: true, clientX: 33, clientY: 44 };

          container.onHandleResize(event as any, 'top');

          expect(onResize).toHaveBeenCalledWith({
            event, handle: 'top', delta: { x: 23, y: -6 },
          });
        });

        it('should ignore empty handlers', () => {
          const container = new ResizableContainer({});
          container.mainContainerRef = { current: {} } as any;

          expect(() => container.onHandleResize(defaultEvent as any, 'top')).not.toThrow();
          expect(() => container.onHandleResizeEnd(defaultEvent as any, 'top')).not.toThrow();
          expect(() => container.onHandleResizeStart(defaultEvent as any, 'top')).not.toThrow();
        });
      });

      describe('onResizeEnd', () => {
        it('should call onResizeEnd by handle dragging', () => {
          const onResizeEnd = jest.fn();
          const container = new ResizableContainer({ onResizeEnd });
          const event = { dragEvent: true };

          container.onHandleResizeEnd(event as any, 'top');

          expect(onResizeEnd).toHaveBeenCalledTimes(1);
          expect(onResizeEnd).toHaveBeenCalledWith({ event, handle: 'top' });
        });

        it('should change "isResizable" state value', () => {
          const container = new ResizableContainer({});

          container.onHandleResizeStart({} as any, 'top');
          expect(container.isResizing).toBe(true);
          container.onHandleResizeEnd({} as any, 'top');
          expect(container.isResizing).toBe(false);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add "disabled" and "rtlEnabled" classes', () => {
          let container = new ResizableContainer({});
          expect(container.cssClasses).toEqual('dx-resizable');

          container = new ResizableContainer({ rtlEnabled: true, disabled: true });
          expect(container.cssClasses).toEqual('dx-resizable dx-state-disabled dx-rtl');
        });

        it('should add marker class if isResizing state is true', () => {
          const container = new ResizableContainer({});
          container.isResizing = true;
          expect(container.cssClasses).toEqual('dx-resizable dx-resizable-resizing');
        });
      });

      describe('styles', () => {
        it('should prefer props to restAttributes', () => {
          const container = new ResizableContainer({
            width: 40,
            height: 50,
            restAttributes: { style: { width: 10, height: 20 } },
          } as any);
          expect(container.styles).toEqual({ width: 40, height: 50 });
        });
      });

      describe('handles', () => {
        it('should return correct corners for user defined handles', () => {
          const getHandles = (handles) => new ResizableContainer({ handles }).handles.sort();

          expect(getHandles('top'))
            .toEqual(['top']);
          expect(getHandles(['left', 'top']))
            .toEqual(['corner-top-left', 'top', 'left'].sort());
          expect(getHandles(['right', 'top']))
            .toEqual(['corner-top-right', 'top', 'right'].sort());
          expect(getHandles(['bottom', 'right']))
            .toEqual(['corner-bottom-right', 'bottom', 'right'].sort());
          expect(getHandles(['bottom', 'left']))
            .toEqual(['corner-bottom-left', 'bottom', 'left'].sort());
        });
      });
    });
  });
});

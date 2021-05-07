import React, { createRef } from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  emit, getEventHandlers, clear as clearEventHandlers, EVENT,
} from '../../../test_utils/events_mock';
import { DraggableContainer, DraggableContainerProps, viewFunction as DraggableView } from '../container';
import { DisposeEffectReturn } from '../../../utils/effect_return';

describe('DataGrid', () => {
  describe('View', () => {
    it('default render', () => {
      const mockRef = createRef();
      const props = new DraggableContainerProps();
      props.children = [];
      const draggableProps = {
        cssClasses: 'test',
        widgetRef: mockRef,
        restAttributes: { 'rest-attributes': 'true' },
        props,
      } as unknown as DraggableContainer;
      const tree = mount(<DraggableView {...draggableProps as any} /> as any);

      expect(tree.find('div').props()).toMatchObject({
        ...props,
        className: 'test',
        'rest-attributes': 'true',
      });

      expect(tree.find('div').instance()).toBe(mockRef.current);
    });

    it('should render children', () => {
      const props = {
        children: <div className="child" />,
      };
      const widget = mount(DraggableView({
        props,
      } as any) as any);

      expect(widget.find('.child').exists()).toBe(true);
    });
  });

  describe('Logic', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add \'className\' class', () => {
          const draggable = new DraggableContainer({ className: 'custom-class' });

          expect(draggable.cssClasses).toEqual('custom-class dx-draggable');
        });

        it('should add rtl class', () => {
          const draggable = new DraggableContainer({ rtlEnabled: true });

          expect(draggable.cssClasses).toEqual('dx-draggable dx-rtl');
        });

        it('should add disabled class', () => {
          const draggable = new DraggableContainer({ disabled: true });

          expect(draggable.cssClasses).toEqual('dx-draggable dx-state-disabled');
        });

        it('should add dragging class', () => {
          const draggable = new DraggableContainer({});

          draggable.isDragging = true;

          expect(draggable.cssClasses).toEqual('dx-draggable dx-draggable-dragging');
        });
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('dragEffect', () => {
        beforeEach(clearEventHandlers);

        afterEach(() => {
          jest.resetAllMocks();
        });

        it('should subscribe to drag events', () => {
          const draggable = new DraggableContainer({});

          const widgetRef = createRef() as any;
          draggable.widgetRef = widgetRef;
          draggable.dragStartHandler = jest.fn();
          draggable.dragMoveHandler = jest.fn();
          draggable.dragEndHandler = jest.fn();

          draggable.dragEffect();

          emit(EVENT.dragStart);

          expect(draggable.dragStartHandler).toHaveBeenCalledTimes(1);
          expect(draggable.dragMoveHandler).toHaveBeenCalledTimes(0);
          expect(draggable.dragEndHandler).toHaveBeenCalledTimes(0);

          emit(EVENT.dragMove);

          expect(draggable.dragStartHandler).toHaveBeenCalledTimes(1);
          expect(draggable.dragMoveHandler).toHaveBeenCalledTimes(1);
          expect(draggable.dragEndHandler).toHaveBeenCalledTimes(0);

          emit(EVENT.dragEnd);

          expect(draggable.dragStartHandler).toHaveBeenCalledTimes(1);
          expect(draggable.dragMoveHandler).toHaveBeenCalledTimes(1);
          expect(draggable.dragEndHandler).toHaveBeenCalledTimes(1);
        });

        it('should return unsubscribe callback', () => {
          const draggable = new DraggableContainer({});

          const widgetRef = createRef() as any;
          draggable.widgetRef = widgetRef;
          draggable.dragStartHandler = jest.fn();
          draggable.dragMoveHandler = jest.fn();
          draggable.dragEndHandler = jest.fn();

          const detach = draggable.dragEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.dragStart).length).toBe(1);
          expect(getEventHandlers(EVENT.dragMove).length).toBe(1);
          expect(getEventHandlers(EVENT.dragEnd).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.dragStart).length).toBe(0);
          expect(getEventHandlers(EVENT.dragMove).length).toBe(0);
          expect(getEventHandlers(EVENT.dragEnd).length).toBe(0);
        });

        it('should not subscribe to drag events if widget is disabled', () => {
          const draggable = new DraggableContainer({ disabled: true });

          const widgetRef = createRef() as any;
          draggable.widgetRef = widgetRef;
          draggable.dragStartHandler = jest.fn();
          draggable.dragMoveHandler = jest.fn();
          draggable.dragEndHandler = jest.fn();

          draggable.dragEffect();

          expect(getEventHandlers(EVENT.dragStart)).toBe(undefined);
          expect(getEventHandlers(EVENT.dragMove)).toBe(undefined);
          expect(getEventHandlers(EVENT.dragEnd)).toBe(undefined);
        });
      });
    });

    describe('Events', () => {
      it('onDragStart', () => {
        const onDragStart = jest.fn();
        const event = {} as Event;
        const draggable = new DraggableContainer({ onDragStart, data: 'test' });
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        draggable.dragStartHandler(event);

        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toHaveBeenCalledWith({
          event,
          data: 'test',
          itemElement: widgetRef.current,
        });
      });

      it('call dragStartHandler without onDragStart prop', () => {
        const event = {} as Event;
        const draggable = new DraggableContainer({});
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        expect(draggable.dragStartHandler.bind(draggable, event)).not.toThrow();
      });

      it('onDragMove', () => {
        const onDragMove = jest.fn();
        const event = {} as Event;
        const draggable = new DraggableContainer({ onDragMove, data: 'test' });
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        draggable.dragMoveHandler(event);

        expect(onDragMove).toHaveBeenCalledTimes(1);
        expect(onDragMove).toHaveBeenCalledWith({
          event,
          data: 'test',
          itemElement: widgetRef.current,
        });
      });

      it('call dragMoveHandler without onDragMove prop', () => {
        const event = {} as Event;
        const draggable = new DraggableContainer({});
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        expect(draggable.dragMoveHandler.bind(draggable, event)).not.toThrow();
      });

      it('onDragEnd', () => {
        const onDragEnd = jest.fn();
        const event = {} as Event;
        const draggable = new DraggableContainer({ onDragEnd, data: 'test' });
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        draggable.dragEndHandler(event);

        expect(onDragEnd).toHaveBeenCalledTimes(1);
        expect(onDragEnd).toHaveBeenCalledWith({
          event,
          data: 'test',
          itemElement: widgetRef.current,
        });
      });

      it('call dragEndHandler without onDragEnd prop', () => {
        const event = {} as Event;
        const draggable = new DraggableContainer({});
        const widgetRef = { current: {} as any } as any;
        draggable.widgetRef = widgetRef;

        expect(draggable.dragEndHandler.bind(draggable, event)).not.toThrow();
      });
    });
  });
});

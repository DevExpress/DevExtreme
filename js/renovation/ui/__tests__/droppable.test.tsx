import React, { createRef } from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  emit, getEventHandlers, clear as clearEventHandlers, EVENT,
} from '../../test_utils/events_mock';
import { Droppable, DroppableProps, viewFunction as DroppableView } from '../droppable';
import { DisposeEffectReturn } from '../../utils/effect_return';

describe('Droppable', () => {
  describe('View', () => {
    it('default render', () => {
      const mockRef = createRef();
      const props = new DroppableProps();
      const droppableProps = {
        cssClasses: 'test',
        widgetRef: mockRef,
        restAttributes: { 'rest-attributes': 'true' },
        props,
      } as unknown as Droppable;
      const tree = mount(<DroppableView {...droppableProps as any} /> as any);

      expect(tree.find('div').props()).toMatchObject({
        className: 'test',
        'rest-attributes': 'true',
      });

      expect(tree.find('div').instance()).toBe(mockRef.current);
    });

    it('should render children', () => {
      const props = {
        children: <div className="child" />,
      };
      const widget = mount(DroppableView({
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
          const droppable = new Droppable({ className: 'custom-class' });

          expect(droppable.cssClasses).toEqual('custom-class dx-droppable');
        });

        it('should add disabled class', () => {
          const droppable = new Droppable({ disabled: true });

          expect(droppable.cssClasses).toEqual('dx-droppable dx-state-disabled');
        });
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('dropEventsEffect', () => {
        beforeEach(clearEventHandlers);

        afterEach(() => {
          jest.resetAllMocks();
        });

        it('should subscribe to drop events', () => {
          const droppable = new Droppable({});

          const widgetRef = createRef() as any;
          droppable.widgetRef = widgetRef;
          droppable.dragEnterHandler = jest.fn();
          droppable.dragLeaveHandler = jest.fn();
          droppable.dropHandler = jest.fn();

          droppable.dropEventsEffect();

          emit(EVENT.dragEnter);

          expect(droppable.dragEnterHandler).toHaveBeenCalledTimes(1);
          expect(droppable.dragLeaveHandler).toHaveBeenCalledTimes(0);
          expect(droppable.dropHandler).toHaveBeenCalledTimes(0);

          emit(EVENT.dragLeave);

          expect(droppable.dragEnterHandler).toHaveBeenCalledTimes(1);
          expect(droppable.dragLeaveHandler).toHaveBeenCalledTimes(1);
          expect(droppable.dropHandler).toHaveBeenCalledTimes(0);

          emit(EVENT.drop);

          expect(droppable.dragEnterHandler).toHaveBeenCalledTimes(1);
          expect(droppable.dragLeaveHandler).toHaveBeenCalledTimes(1);
          expect(droppable.dropHandler).toHaveBeenCalledTimes(1);
        });

        it('should return unsubscribe callback', () => {
          const droppable = new Droppable({});

          const widgetRef = createRef() as any;
          droppable.widgetRef = widgetRef;
          droppable.dragEnterHandler = jest.fn();
          droppable.dragLeaveHandler = jest.fn();
          droppable.dropHandler = jest.fn();

          const detach = droppable.dropEventsEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.dragEnter).length).toBe(1);
          expect(getEventHandlers(EVENT.dragLeave).length).toBe(1);
          expect(getEventHandlers(EVENT.drop).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.dragEnter).length).toBe(0);
          expect(getEventHandlers(EVENT.dragLeave).length).toBe(0);
          expect(getEventHandlers(EVENT.drop).length).toBe(0);
        });

        it('should not subscribe to drop events if widget is disabled', () => {
          const droppable = new Droppable({ disabled: true });

          const widgetRef = createRef() as any;
          droppable.widgetRef = widgetRef;
          droppable.dragEnterHandler = jest.fn();
          droppable.dragLeaveHandler = jest.fn();
          droppable.dropHandler = jest.fn();

          droppable.dropEventsEffect();

          expect(getEventHandlers(EVENT.dragStart)).toBe(undefined);
          expect(getEventHandlers(EVENT.dragMove)).toBe(undefined);
          expect(getEventHandlers(EVENT.dragEnd)).toBe(undefined);
        });
      });
    });

    describe('Events', () => {
      it('onDragEnter', () => {
        const onDragEnter = jest.fn();
        const event = {} as Event;
        const droppable = new Droppable({ onDragEnter });
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        droppable.dragEnterHandler(event);

        expect(onDragEnter).toHaveBeenCalledTimes(1);
        expect(onDragEnter).toHaveBeenCalledWith({
          event,
          itemElement: widgetRef.current,
        });
      });

      it('call dragEnterHandler without onDragEnter prop', () => {
        const event = {} as Event;
        const droppable = new Droppable({});
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        expect(droppable.dragEnterHandler.bind(droppable, event)).not.toThrow();
      });

      it('onDragLeave', () => {
        const onDragLeave = jest.fn();
        const event = {} as Event;
        const droppable = new Droppable({ onDragLeave });
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        droppable.dragLeaveHandler(event);

        expect(onDragLeave).toHaveBeenCalledTimes(1);
        expect(onDragLeave).toHaveBeenCalledWith({
          event,
          itemElement: widgetRef.current,
        });
      });

      it('call dragLeaveHandler without onDragLeave prop', () => {
        const event = {} as Event;
        const droppable = new Droppable({});
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        expect(droppable.dragLeaveHandler.bind(droppable, event)).not.toThrow();
      });

      it('onDrop', () => {
        const onDrop = jest.fn();
        const event = {} as Event;
        const droppable = new Droppable({ onDrop });
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        droppable.dropHandler(event);

        expect(onDrop).toHaveBeenCalledTimes(1);
        expect(onDrop).toHaveBeenCalledWith({
          event,
          itemElement: widgetRef.current,
        });
      });

      it('call dropHandler without onDrop prop', () => {
        const event = {} as Event;
        const droppable = new Droppable({});
        const widgetRef = { current: {} as any } as any;
        droppable.widgetRef = widgetRef;

        expect(droppable.dropHandler.bind(droppable, event)).not.toThrow();
      });
    });
  });
});

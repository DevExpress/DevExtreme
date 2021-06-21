import { shallow } from 'enzyme';
import {
  clear as clearEventHandlers,
  defaultEvent,
  emit,
  getEventHandlers,
  EVENT,
} from '../../../test_utils/events_mock';
import { ResizableHandle, viewFunction } from '../handle';

describe('Resizable Handle', () => {
  describe('View', () => {
    it('should add resizable handle class', () => {
      const handle = shallow(viewFunction({ props: { direction: 'direction' } } as any));
      expect(handle.hasClass('dx-resizable-handle')).toBe(true);
      expect(handle.hasClass('dx-resizable-handle-direction')).toBe(true);
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('dragEventsEffect', () => {
        afterEach(clearEventHandlers);

        it('should not attach event handler if "disabled" is "true"', () => {
          const handle = new ResizableHandle({ disabled: true });

          handle.mainRef = { current: {} } as any;

          const detach = handle.dragEventsEffect();

          expect(detach).toBeUndefined();
          expect(getEventHandlers(EVENT.drag)).toBeUndefined();
          expect(getEventHandlers(EVENT.dragStart)).toBeUndefined();
          expect(getEventHandlers(EVENT.dragEnd)).toBeUndefined();
        });

        it('should return detach callback', () => {
          const handle = new ResizableHandle({});

          handle.mainRef = { current: {} } as any;

          const detach = handle.dragEventsEffect();

          expect(!!getEventHandlers(EVENT.dragStart)).toBe(true);
          expect(getEventHandlers(EVENT.drag)).toBeUndefined();
          expect(getEventHandlers(EVENT.dragEnd)).toBeUndefined();

          expect(detach).not.toBeUndefined();
          (detach as any)();
          expect(getEventHandlers(EVENT.dragStart).length).toBe(0);
        });

        it('should attach "drag" and "dragEnd" events after the start of the dragging', () => {
          const handle = new ResizableHandle({});

          handle.mainRef = { current: {} } as any;

          const detach = handle.dragEventsEffect();

          expect(!!getEventHandlers(EVENT.dragStart)).toBe(true);
          expect(getEventHandlers(EVENT.drag)).toBeUndefined();
          expect(getEventHandlers(EVENT.dragEnd)).toBeUndefined();

          emit(EVENT.dragStart, defaultEvent, handle.mainRef.current);

          expect(!!getEventHandlers(EVENT.dragStart)).toBe(true);
          expect(!!getEventHandlers(EVENT.drag)).toBe(true);
          expect(!!getEventHandlers(EVENT.dragEnd)).toBe(true);

          (detach as any)();
          expect(getEventHandlers(EVENT.dragStart).length).toBe(0);
          expect(getEventHandlers(EVENT.drag).length).toBe(0);
          expect(getEventHandlers(EVENT.dragEnd).length).toBe(0);
        });
      });
    });

    describe('Events', () => {
      describe('onResizeStart', () => {
        it('should call onResizeStart by the "dragStart" event', () => {
          const onResize = jest.fn();
          const onResizeStart = jest.fn();
          const onResizeEnd = jest.fn();
          const handle = new ResizableHandle({ onResize, onResizeStart, onResizeEnd });

          handle.mainRef = { current: {} } as any;

          handle.dragEventsEffect();
          emit(EVENT.dragStart, defaultEvent, handle.mainRef.current);

          expect(onResize).toHaveBeenCalledTimes(0);
          expect(onResizeEnd).toHaveBeenCalledTimes(0);
          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResizeStart).toHaveBeenCalledWith(defaultEvent);
        });
      });

      describe('onResize', () => {
        it('should call onResize by drag event', () => {
          const onResize = jest.fn();
          const onResizeStart = jest.fn();
          const onResizeEnd = jest.fn();
          const handle = new ResizableHandle({ onResize, onResizeStart, onResizeEnd });

          handle.mainRef = { current: {} } as any;

          handle.dragEventsEffect();

          emit(EVENT.dragStart, defaultEvent, handle.mainRef.current);

          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledTimes(0);
          expect(onResizeEnd).toHaveBeenCalledTimes(0);

          emit(EVENT.drag, defaultEvent, handle.mainRef.current);

          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResizeEnd).toHaveBeenCalledTimes(0);
          expect(onResize).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledWith(defaultEvent);
        });
      });

      describe('onResizeEnd', () => {
        it('should call onResizeEnd by dragEnd event', () => {
          const onResize = jest.fn();
          const onResizeStart = jest.fn();
          const onResizeEnd = jest.fn();
          const handle = new ResizableHandle({ onResize, onResizeStart, onResizeEnd });

          handle.mainRef = { current: {} } as any;

          handle.dragEventsEffect();

          emit(EVENT.dragStart, defaultEvent, handle.mainRef.current);
          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledTimes(0);
          expect(onResizeEnd).toHaveBeenCalledTimes(0);

          emit(EVENT.drag, defaultEvent, handle.mainRef.current);
          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledTimes(1);
          expect(onResizeEnd).toHaveBeenCalledTimes(0);

          emit(EVENT.dragEnd, defaultEvent, handle.mainRef.current);
          expect(onResizeStart).toHaveBeenCalledTimes(1);
          expect(onResize).toHaveBeenCalledTimes(1);
          expect(onResizeEnd).toHaveBeenCalledTimes(1);
          expect(onResizeEnd).toHaveBeenCalledWith(defaultEvent);
        });
      });
    });
  });
});
